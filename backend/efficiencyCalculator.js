// energy-audit-backend/utils/efficiencyCalculator.js

export const calculateEfficiencyScoreBE = (formData) => {
    // ... (same logic as above) ...
    let score = 50;

    if (formData.buildingType === 'residential') score += 5;
    if (formData.areaSqft && parseInt(formData.areaSqft) < 1000) score += 5;
    else if (formData.areaSqft && parseInt(formData.areaSqft) > 3000) score -= 5;

    switch (formData.lightingType) {
        case 'led': score += 15; break;
        case 'cfl': score += 10; break;
        case 'incandescent': score -= 10; break;
        default: break;
    }
    
    if (formData.hvacAgeYears && parseInt(formData.hvacAgeYears) < 5) score += 10;
    else if (formData.hvacAgeYears && parseInt(formData.hvacAgeYears) > 15) score -= 10;
    
    const insulationRating = formData.insulationRating || "";
    if (insulationRating.toLowerCase().includes('r-19') || insulationRating.toLowerCase().includes('r-20') || insulationRating.toLowerCase().includes('r-30')) score += 10;
    else if (insulationRating.toLowerCase().includes('r-13')) score += 5;


    switch (formData.windowType) {
        case 'double_pane_low_e': score += 15; break;
        case 'double_pane': score += 10; break;
        case 'single_pane': score -= 10; break;
        default: break;
    }

    const renewableKw = parseFloat(formData.renewableEnergyKw);
    if (!isNaN(renewableKw) && renewableKw > 0) {
        score += renewableKw * 2;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
};

export default { calculateEfficiencyScoreBE };