import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IssueCert from './components/IssueCert';

import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/submit";
import AdminLogin from "./pages/adminLogin";
import AdminDashboard from "./pages/adminDashboard";
import AdminUsers from "./pages/adminUsers";
import AdminAuditDetails from "./pages/adminAuditDetails";
import LandingPage from "./pages/LandingPage";

import Navbar from './components/Navbar';
import AuditForm from './components/AuditForm';
import AuditResult from './components/AuditResult';
import PreviousAudits from './components/PreviousAudits';
import CertificatePage from './components/CertificatePage';

import 'react-toastify/dist/ReactToastify.css';
import { calculateEfficiencyScore } from './utils/efficiencyCalculator';
import { generateCertificateHTML } from './utils/certificateGenarator';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function AppLogic() { // Renamed from AppContent for clarity if App is the Router wrapper
    // HOOKS MUST BE CALLED AT THE TOP LEVEL OF THE FUNCTIONAL COMPONENT
    const navigate = useNavigate(); // Initialize navigate
    const [audits, setAudits] = useState(() => { // Initialize audits and setAudits
        const savedAudits = localStorage.getItem('energyAudits');
        return savedAudits ? JSON.parse(savedAudits) : [];
    });

  
    useEffect(() => {
        const fetchAllAudits = async () => {
            try {
                console.log("Fetching all audits from backend...");
                const response = await fetch(`${API_BASE_URL}/audits`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // optional if you're securing
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch audits: ${response.status}`);
                }
                const data = await response.json();
                console.log("Audits fetched from backend:", data);
                setAudits(data);
                localStorage.setItem('energyAudits', JSON.stringify(data));
            } catch (error) {
                console.error("Error fetching initial audits:", error);
            }
        };
        fetchAllAudits();
    }, []);

    useEffect(() => {
        localStorage.setItem('energyAudits', JSON.stringify(audits));
    }, [audits]);

    const handleAuditSubmit = async (formDataFromForm) => {
        console.log("handleAuditSubmit called with formData:", formDataFromForm);
        try {
            const response = await fetch(`${API_BASE_URL}/audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // if using auth
                },
                body: JSON.stringify(formDataFromForm),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to submit audit.`);
            }

            const newAudit = await response.json();
            const certificateHTML = generateCertificateHTML(
                newAudit.formData,
                newAudit.score,
                newAudit.id
            );

            setAudits(prev => [newAudit, ...prev.filter(a => a.id !== newAudit.id)]);
            navigate('/result', {
                state: {
                    auditData: newAudit.formData,
                    score: newAudit.score,
                    certificateHTML,
                    certificateId: newAudit.id
                }
            });
        } catch (error) {
            console.error("Error during handleAuditSubmit:", error);
            alert(`Submission Error: ${error.message}`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/IssueCert" element={<IssueCert />} />
                   
                    <Route path="/submit-audit" element={<AuditForm onSubmitAudit={handleAuditSubmit} />} />
                    <Route path="/result" element={<AuditResult />} />
                    <Route path="/previous-audits" element={<PreviousAudits audits={audits} />} />
                    <Route path="/certificate/:certificateId" element={<CertificatePage audits={audits} />} />
                     <Route path="/submit" element={<Submit />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/audits/:auditId" element={<AdminAuditDetails />} />
                    <Route path="*" element={
                        <div>
                            <h2>404 Page Not Found</h2>
                            <button onClick={() => navigate('/')}>Go Home</button>
                        </div>
                    } />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppLogic />
          
        </Router>
    );
}

export default App;
