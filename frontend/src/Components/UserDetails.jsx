import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../Http/ApiService";
import "./UserDetails.css"; // Make sure the path is correct

function UserDetailsPage() {
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [batch, setBatch] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const { id } = useParams();
  const service = new ApiService();
  const navigate = useNavigate()

  const handleStartTest = async () => {
    if (fullName && college && batch && rollNumber) {
      try {
        const response = await service.post("/save-details",{
          testId: id,
          fullName,
          college,
          batch,
          rollNumber,
        });

        if (response && response.message==="User details saved successfully") {
          localStorage.setItem("userId",response?.userDetails._id)
          navigate(`/test/${id}`);
        } else {
          alert("Error starting test.");
        }
      } catch (error) {
        console.error("Error starting test:", error);
        alert("Error starting test.");
      }
    } else {
      alert("Please fill in all details.");
    }
  };

  return (
    <div className="user-details-page">
      <Container>
        <Row>
          <Col>
            <Card className="user-details-form">
              <Card.Body>
                <h1 className="text-center">Enter Your Details</h1>
                <Form>
                  <Form.Group controlId="fullName">
                    <Form.Label className="form-label">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group controlId="college">
                    <Form.Label className="form-label">College</Form.Label>
                    <Form.Control
                      as="select"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Select College</option>
                      <option value="NIET">NIET</option>
                      <option value="other">Other</option>
                      {/* Add more college options */}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="batch">
  <Form.Label className="form-label">Batch</Form.Label>
  <Form.Control
    as="select"
    value={batch}
    onChange={(e) => setBatch(e.target.value)}
    className="form-control"
  >
    <option value="">Select Batch</option>
    <option value="Batch 1">Batch 1</option>
    <option value="Batch 2">Batch 2</option>
    <option value="Batch 3">Batch 3</option>
    <option value="Batch 4">Batch 4</option>
    <option value="Batch 5">Batch 5</option>
    <option value="Batch 6">Batch 6</option>
    <option value="Batch 7">Batch 7</option>
    <option value="Batch 8">Batch 8</option>
    <option value="Batch 9">Batch 9</option>
    <option value="Batch 10">Batch 10</option>
    <option value="Batch 11">Batch 11</option>
    <option value="Batch 12">Batch 12</option>
    <option value="Batch 13">Batch 13</option>
    <option value="Batch 14">Batch 14</option>
    <option value="Batch 15">Batch 15</option>
    <option value="Batch 16">Batch 16</option>
    <option value="Batch 17">Batch 17</option>
  </Form.Control>
</Form.Group>

                  <Form.Group controlId="rollNumber">
                    <Form.Label className="form-label">Roll Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your roll number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                  <p className="test-instructions">
                  Instructions: Once you start the test, you must answer each question by selecting an option. To proceed to the next question, click the "Next Question" button. Do not refresh the page during the test.
                </p>
                  <Button
                    variant="primary"
                    onClick={handleStartTest}
                    className="btn"
                  >
                    Start Test
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserDetailsPage;
