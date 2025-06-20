import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ServerPage from "./pages/ServerPage";
import Navbar from "./components/Navbar";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/server" element={<ServerPage />} />
            </Routes>
        </Router>
    );
}

export default App;
