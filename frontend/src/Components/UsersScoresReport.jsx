import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ApiService from '../Http/ApiService';
import { useParams } from 'react-router-dom';
import './UserScoresReport.css';

function UserScoresReport() {
  const [userScores, setUserScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const service = new ApiService();
  const { id } = useParams();

  useEffect(() => {
    fetchUserScores();
  }, []);

  const fetchUserScores = async () => {
    try {
      const response = await service.get(`/test/report/${id}`); // Replace testId with the actual testId
      setUserScores(response?.data);
      setIsLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error('Error fetching user scores:', error);
      setIsLoading(false); // Set loading to false even in case of an error
    }
  };

  const handleDownloadExcel = () => {
    const excelData = [
      ['Full Name', 'Roll Number', 'Batch', 'College', 'Score'],
      ...userScores.map((user) => [user.fullName, user.rollNumber, user.batch, user.college, user.score]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UserScores');
    const excelFileName = 'user_scores_report.xlsx';
    XLSX.writeFile(wb, excelFileName);
  };

  return (
    <Container className="user-scores-report">
      <h1 className="report-title">User Scores Report</h1>
      {isLoading ? (
        <Spinner animation="border" role="status" className="loading-spinner">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <>
          <Button variant="success" onClick={handleDownloadExcel} className="download-button">
            Download Excel
          </Button>
          <Table striped bordered hover className="user-scores-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Roll Number</th>
                <th>Batch</th>
                <th>College</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {userScores.map((user, index) => (
                <tr key={index}>
                  <td>{user.fullName}</td>
                  <td>{user.rollNumber}</td>
                  <td>{user.batch}</td>
                  <td>{user.college}</td>
                  <td>{user.score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}

export default UserScoresReport;
