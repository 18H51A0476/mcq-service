import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./TestCompletedPage.css"; // Import the CSS file

function TestCompletedPage() {
  return (
    <div className="test-completed-page">
      <Container>
        <Row>
          <Col>
            <div className="completed-message">
              <h1>Test Completed</h1>
              <p>Congratulations! You have successfully completed the test.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TestCompletedPage;
