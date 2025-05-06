import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';

function App() {

  const isLoggedIn =
    localStorage.getItem('username') && localStorage.getItem('password');

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SettingsPage />} />
          <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/settings" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
