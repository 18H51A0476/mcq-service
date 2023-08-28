const express = require("express");
const bodyParser = require("body-parser");
const cache = require("memory-cache");
const cors = require("cors");
const path = require('path');
const connectToMongoDB = require("./db/mongoDBconnection");
require("dotenv").config();
const port = process.env.PORT || 3000;
const Mcq = require("./models/mcq");
const Test = require("./models/test");
const Mapping = require("./models/mapping");
const UserDetails = require("./models/userdetails");
const UserResponse = require("./models/userresponse");

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// POST route to add MCQs to the database
app.post("/add-mcqs", async (req, res) => {
  const mcqList = req.body.mcqs;
  const testName = req.body.testName;

  try {
    // Create a test record
    const test = new Test({ testName });
    const savedTest = await test.save();

    // Create and save the MCQ records and mapping records
    const mcqPromises = mcqList.map(async (mcq) => {
      const newMcq = new Mcq(mcq);
      const savedMcq = await newMcq.save();

      const mapping = new Mapping({
        test: savedTest._id,
        mcq: savedMcq._id,
      });
      await mapping.save();

      return savedMcq;
    });

    const savedMcqs = await Promise.all(mcqPromises);

    res
      .status(201)
      .json({ message: "MCQs added to the database", data: savedTest._id });
  } catch (error) {
    console.error("Error adding MCQs to the database:", error);
    res.status(500).json({ message: "Error adding MCQs to the database" });
  }
});

// GET route to fetch all MCQs of a particular test
app.get("/get-mcqs/:testId", async (req, res) => {
  const testId = req.params.testId;

  // Check if the data is already cached
  const cachedData = cache.get(testId);
  if (cachedData) {
    console.log("data from cache")
    return res.status(200).json(cachedData);
  }

  try {
    const test = await Test.findOne({ _id: testId });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (!test.testStatus) {
      const inactiveTestData = {
        message: "Test is not active",
        data: [],
        testName: test.testName,
        testStatus: test.testStatus,
      };
      return res.status(200).json(inactiveTestData);
    }

    const mappings = await Mapping.find({ test: testId });
    const mcqIds = mappings.map((mapping) => mapping.mcq);

    const mcqs = await Mcq.find(
      { _id: { $in: mcqIds } },
      "-correctAnswerIndex"
    );

    const responseData = {
      message: "MCQs fetched successfully",
      testName: test.testName,
      data: mcqs,
      testStatus: test.testStatus,
    };
    cache.put(testId, responseData, 60000*60); // Cache for 1 minute (adjust as needed)

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching MCQs:", error);
    res.status(500).json({ message: "Error fetching MCQs" });
  }
});

app.post("/save-details", async (req, res) => {
  try {
    const { testId, fullName, college, batch, rollNumber } = req.body;

    const userDetails = new UserDetails({
      testId,
      fullName,
      college,
      batch,
      rollNumber,
    });

    const savedUserDetails = await userDetails.save();
    res
      .status(201)
      .json({
        message: "User details saved successfully",
        userDetails: savedUserDetails,
      });
  } catch (error) {
    console.error("Error saving user details:", error);
    res.status(500).json({ message: "Error saving user details" });
  }
});

// Endpoint to submit user responses
app.post("/submit-responses", async (req, res) => {
  const { testId, userId, responses } = req.body;

  try {
    // Fetch user details by userId
    const userDetails = await UserDetails.findOne({ _id: userId });

    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Create a new object to store user responses
    const userResponse = {
      testId,
      userId,
      responses,
    };

    // Save user responses to the database
    // Assuming you have a Responses model
    const savedResponse = await UserResponse.create(responses);

    res.status(200).json({ message: "User responses submitted successfully" });
  } catch (error) {
    console.error("Error submitting responses:", error);
    res.status(500).json({ message: "Error submitting responses" });
  }
});

app.get("/test/report/:testId", async (req, res) => {
  const { testId } = req.params;

  try {
    const users = await UserDetails.find({ testId });
    const userScores = [];

    for (const user of users) {
      const responses = await UserResponse.find({ userId: user._id });
      let score = 0;

      for (const response of responses) {
        const mcq = await Mcq.findById(response.questionId);
        if (mcq.correctAnswer === response.selectedAnswer) {
          score++;
        }
      }

      userScores.push({
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        batch: user.batch,
        college: user.college,
        score,
      });
    }

    userScores.sort((a, b) => b.score - a.score);

    // console.log('User Scores Report:', userScores);

    // You can also save this report to a database or return it as an API response
    res.status(200).json({ data: userScores, message: "success" });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
});

// Serve the frontend static files
app.use(express.static(path.join(__dirname, './frontend/build')));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
