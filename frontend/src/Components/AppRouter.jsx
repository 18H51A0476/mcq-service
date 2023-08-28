import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MainPage from "./MainPage";
import TestPage from "./TestPage";
import AdminPage from "./AdminPage";
import UserDetailsPage from "./UserDetails";
import TestCompletedPage from "./TestCompletedmessage";
import UserScoresReport from "./UsersScoresReport";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/test/details/:id" element={<UserDetailsPage />} />
        <Route path="/test/report/:id" element={<UserScoresReport />} />
        <Route path="/test/:id" element={<TestPage />} />
        <Route path="/completed" element={<TestCompletedPage/>} />
        {/* Add a catch-all route to handle unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
