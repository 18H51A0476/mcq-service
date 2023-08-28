import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./TestPage.css"; // Import custom CSS for styling
import ApiService from "../Http/ApiService";
import { useParams,useNavigate } from "react-router-dom";

function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(10);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testName, setTestName] = useState("");
  const [testStatus, setTestStatus] = useState(false); // Assume the test is not active by default
  const [userResponses, setUserResponses] = useState([]); // Array to store user responses
  const service = new ApiService();
  const navigate = useNavigate()
  const { id } = useParams();
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    service.get(`/get-mcqs/${id}`)
      .then(response => {
        const { data, testName, testStatus } = response;
        setQuestions(data);
        setTestName(testName);
        setTestStatus(testStatus);
      })
      .catch(error => {
        console.error('Error fetching MCQs:', error);
      });

  }, [ id]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (!testCompleted && testStatus && timer > 0) {
        setTimer(prevTimer => prevTimer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testCompleted, timer, testStatus]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const sendUserResponsesToBackend = async () => {
    try {
      // Get userId from localStorage (replace with your logic)
      const userId = localStorage.getItem("userId");

      // Send userResponses array to backend
      await service.post("/submit-responses", {
        testId: id,
        userId,
        responses: userResponses,
      });

      // Navigate to the completion page or any other page
      navigate("/completed");
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Store user response for the current question
      const response = {
        questionId: questions[currentQuestionIndex]._id,
        selectedAnswer,
        testId: id,
        userId,
      };
      setUserResponses((prevResponses) => [...prevResponses, response]);

      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setTimer(10);
    } else {
      setTestCompleted(true);
    }
  };

  // Automatically submit responses when test is completed
  useEffect(() => {
    if (testCompleted && userResponses.length > 0) {
      sendUserResponsesToBackend();
    }
  }, [testCompleted, userResponses]);

  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer]);

  return (
    <div className="test-page">
      <Container>
        <Row>
          <Col>
            <div className="test-heading">
              <h1>MCQ Test: {testName}</h1>
            </div>
          </Col>
        </Row>
        {testStatus && !testCompleted && questions.length > 0 && (
          <Row>
            <Col>
              <div className="question-container">
                <h2 className="question">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="question-text">
                  {questions[currentQuestionIndex]?.question}
                </p>
                <ul className="options-list">
                  {["option1", "option2", "option3", "option4"].map(
                    (optionKey, index) => (
                      <li className="option" key={index}>
                        <label>
                          <input
                            type="radio"
                            name="answerOptions"
                            value={optionKey}
                            checked={selectedAnswer === optionKey}
                            onChange={() => handleAnswerSelect(optionKey)}
                            disabled={timer === 0}
                          />
                          {questions[currentQuestionIndex][optionKey]}
                        </label>
                      </li>
                    )
                  )}
                </ul>
                {selectedAnswer !== null ? (
                  <Button className="next-button" onClick={handleNextQuestion}>
                    Next Question
                  </Button>
                ) : (
                  <Button className="next-button disabled" disabled>
                    Next Question
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        )}
        {testStatus && !testCompleted && (
          <Row className="mt-2">
            <Col>
              <p className="timer">Time remaining: {timer} seconds</p>
            </Col>
          </Row>
        )}
        {!testStatus && (
          <Row className="mt-2">
            <Col>
              <p className="test-not-active">Test is not active</p>
            </Col>
          </Row>
        )}
        {testCompleted && (
          <Row className="mt-2">
            <Col>
              <p className="test-completed">Test completed successfully!</p>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default TestPage;
