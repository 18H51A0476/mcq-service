import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MainPage.css"; // Import custom CSS for styling

const mainPageStyles = {
  background: "#1a1a1a",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const MainPage = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div style={mainPageStyles}>
      <Container className="text-center text-light">
        <Row>
          <Col>
            <h2 className="main-page-title">Welcome to the MCQ Test Application</h2>
            <p className="lead main-page-title">
              This is a sample MCQ test application built with React and Bootstrap.
            </p>
            <p className="main-page-title">Click the button below to start the test.</p>
            <Link to="/test">
              <Button
                className={`main-page-btn ${isButtonHovered ? "hovered" : ""}`}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                Start Test
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MainPage;
