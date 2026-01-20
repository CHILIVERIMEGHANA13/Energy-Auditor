import React, { useState } from 'react';
import './AuditForm.css'; // Create this file for styling

const AuditForm = ({ onSubmitAudit }) => {
    const [formData, setFormData] = useState({
        buildingType: 'residential',
        areaSqft: '',
        lightingType: 'led',
        hvacAgeYears: '',
        insulationRating: '',
        windowType: 'double_pane',
        renewableEnergyKw: '0',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.areaSqft || !formData.hvacAgeYears || !formData.insulationRating) {
            alert("Please fill in all required fields (Area, HVAC Age, Insulation).");
            return;
        }
        onSubmitAudit(formData);
        // Optionally reset form here if needed, or navigation will handle view change
    };

    return (
        <div className="audit-form-container">
            <h2>Submit Energy Audit Details</h2>
            <form onSubmit={handleSubmit} className="audit-form">
                <div className="form-group">
                    <label htmlFor="buildingType">Building Type:</label>
                    <select name="buildingType" id="buildingType" value={formData.buildingType} onChange={handleChange}>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="areaSqft">Area (sq ft): *</label>
                    <input type="number" name="areaSqft" id="areaSqft" value={formData.areaSqft} onChange={handleChange} required min="100"/>
                </div>

                <div className="form-group">
                    <label htmlFor="lightingType">Primary Lighting Type:</label>
                    <select name="lightingType" id="lightingType" value={formData.lightingType} onChange={handleChange}>
                        <option value="led">LED</option>
                        <option value="cfl">CFL</option>
                        <option value="incandescent">Incandescent</option>
                        <option value="halogen">Halogen</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="hvacAgeYears">HVAC System Age (Years): *</label>
                    <input type="number" name="hvacAgeYears" id="hvacAgeYears" value={formData.hvacAgeYears} onChange={handleChange} required min="0"/>
                </div>

                <div className="form-group">
                    <label htmlFor="insulationRating">Wall Insulation Rating (e.g., R-13, R-19): *</label>
                    <input type="text" name="insulationRating" id="insulationRating" value={formData.insulationRating} onChange={handleChange} required placeholder="e.g., R-19"/>
                </div>

                <div className="form-group">
                    <label htmlFor="windowType">Window Type:</label>
                    <select name="windowType" id="windowType" value={formData.windowType} onChange={handleChange}>
                        <option value="single_pane">Single-Pane</option>
                        <option value="double_pane">Double-Pane (Air)</option>
                        <option value="double_pane_low_e">Double-Pane (Low-E/Argon)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="renewableEnergyKw">Renewable Energy Capacity (kW, e.g., Solar):</label>
                    <input type="number" step="0.1" name="renewableEnergyKw" id="renewableEnergyKw" value={formData.renewableEnergyKw} onChange={handleChange} min="0"/>
                </div>

                <button type="submit" className="submit-btn">Calculate & Generate Certificate</button>
            </form>
        </div>
    );
};

export default AuditForm;