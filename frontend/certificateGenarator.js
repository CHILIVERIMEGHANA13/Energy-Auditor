
export const generateCertificateHTML = (auditData, score) => {
    const { buildingType, areaSqft, lightingType, hvacAgeYears, insulationRating, windowType, renewableEnergyKw } = auditData;
    const date = new Date().toLocaleDateString();

    return `
        <div style="border: 2px solid green; padding: 20px; margin: 20px auto; max-width: 600px; font-family: Arial, sans-serif; text-align: center;">
            <h1 style="color: green;">Energy Efficiency Certificate</h1>
            <p>This certifies that an energy audit was conducted on:</p>
            <h2 style="margin-top: 5px; margin-bottom: 20px;">Property Type: ${buildingType.toUpperCase()}</h2>

            <h3>Audit Details:</h3>
            <table style="width: 80%; margin: 20px auto; border-collapse: collapse; text-align: left;">
                <tr><th style="padding: 8px; border: 1px solid #ddd;">Parameter</th><th style="padding: 8px; border: 1px solid #ddd;">Value</th></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Area (sq ft)</td><td style="padding: 8px; border: 1px solid #ddd;">${areaSqft}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Lighting Type</td><td style="padding: 8px; border: 1px solid #ddd;">${lightingType}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">HVAC Age (Years)</td><td style="padding: 8px; border: 1px solid #ddd;">${hvacAgeYears}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Insulation Rating</td><td style="padding: 8px; border: 1px solid #ddd;">${insulationRating}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Window Type</td><td style="padding: 8px; border: 1px solid #ddd;">${windowType}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;">Renewable Energy (kW)</td><td style="padding: 8px; border: 1px solid #ddd;">${renewableEnergyKw} kW</td></tr>
            </table>

            <h2 style="margin-top: 30px;">Efficiency Score: <span style="color: blue;">${score} / 100</span></h2>
            
            <p style="margin-top: 30px; font-size: 0.9em;">Issued on: ${date}</p>
            <p style="font-size: 0.8em;">Certificate ID: ${auditData.id}</p>
            <p style="font-size: 0.7em; color: #777;">This is a simulated certificate for demonstration purposes.</p>
        </div>
    `;
};