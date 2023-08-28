import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import ApiService from '../Http/ApiService';
import './AdminPage.css';

const AdminPage = () => {
  const [uploadedData, setUploadedData] = useState([]);
  const [testName, setTestName] = useState('');
  const [testId, setTestId] = useState('');
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const service = new ApiService();

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setUploadedData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleGenerateTest = async () => {
    try {
      const response = await service.post("/add-mcqs",{
        mcqs: uploadedData,
        testName: testName,
      });

      if (response && response.data) {
        setTestId(response.data);
      } else {
        alert('Error generating test ID.');
      }
    } catch (error) {
      console.error('Error generating test:', error);
      alert('Error generating test.');
    }
  };

  const handleCopyTestLink = () => {
    const testLink = window.location.href + 'test/details/' + testId;
    navigator.clipboard.writeText(testLink);
    setCopied1(true);
  };
  const handleCopyReporttLink = () => {
    const testLink = window.location.href + 'test/report/' + testId;
    navigator.clipboard.writeText(testLink);
    setCopied2(true);
  };

  return (
    <div className="admin-page">
      <h2>Admin Panel</h2>
      <Form.Group>
        <Form.Label className="form-label">Test Name:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter test name"
          className="form-control"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="form-label">Upload Excel Sheet:</Form.Label>
        <Form.Control
          type="file"
          accept=".xls,.xlsx"
          className="form-control"
          onChange={handleExcelUpload}
        />
      </Form.Group>
      <Button variant="primary" className="btn-primary" onClick={handleGenerateTest}>
        Generate Test
      </Button>
      {testId && (
        <div className="test-link">
          <p>Test ID: {testId} generated.</p>
          <p>Click the button to copy the test link:</p>
          <Button onClick={handleCopyTestLink}>{copied1 ? 'Test Link Copied!' : 'Copy Test Link'}</Button>
        </div>
      )}
       {testId && (
        <div className="test-link">
          <p>Click the button to copy the test Report link:</p>
          <Button onClick={handleCopyReporttLink}>{copied2 ? 'Report Link Copied!' : 'Copy Report Link'}</Button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
