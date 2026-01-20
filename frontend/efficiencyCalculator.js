export const calculateEfficiencyScore = (formData) => {
    let score = 50; // Base score

    if (formData.buildingType === 'residential') score += 5;
    if (formData.areaSqft < 1000) score += 5;
    else if (formData.areaSqft > 3000) score -= 5;

    switch (formData.lightingType) {
        case 'led': score += 15; break;
        case 'cfl': score += 10; break;
        case 'incandescent': score -= 10; break;
        default: break;
    }

    if (parseInt(formData.hvacAgeYears) < 5) score += 10;
    else if (parseInt(formData.hvacAgeYears) > 15) score -= 10;

    // Very basic check, R-value is more complex
    if (formData.insulationRating?.toLowerCase().includes('r-19') || formData.insulationRating?.toLowerCase().includes('r-20') || formData.insulationRating?.toLowerCase().includes('r-30')) score += 10;
    else if (formData.insulationRating?.toLowerCase().includes('r-13')) score += 5;


    switch (formData.windowType) {
        case 'double_pane_low_e': score += 15; break;
        case 'double_pane': score += 10; break;
        case 'single_pane': score -= 10; break;
        default: break;
    }

    if (parseFloat(formData.renewableEnergyKw) > 0) {
        score += parseFloat(formData.renewableEnergyKw) * 2;
    }

    return Math.max(0, Math.min(100, Math.round(score))); // Clamp between 0 and 100
};
