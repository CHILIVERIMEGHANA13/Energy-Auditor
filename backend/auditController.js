import { v4 as uuidv4 } from 'uuid';
import Audit from '../models/audit.js';

const calculateScore = ({ energyUsed, appliances, areaSqft, buildingType, hvacAgeYears }) => {
  // Simple sample logic — you can replace this with a better formula
  let score = 100;
  score -= energyUsed * 0.2;
  score -= appliances * 1;
  score -= (hvacAgeYears || 0) * 2;
  if (buildingType.toLowerCase() === 'commercial') score -= 10;

  return Math.max(0, Math.min(score, 100)); // clamp between 0 and 100
};

export const createAudit = async (req, res) => {
  try {
    const { energyUsed, appliances, areaSqft, buildingType, hvacAgeYears } = req.body;

    const score = calculateScore({ energyUsed, appliances, areaSqft, buildingType, hvacAgeYears });

    const newAudit = new Audit({
      energyUsed,
      appliances,
      areaSqft,
      buildingType,
      hvacAgeYears,
      score,
      certificate: {
        id: uuidv4(),
        timestamp: new Date(),
      },
      user: req.user.userId, // from authMiddleware
    });

    await newAudit.save();

    res.status(201).json({ audit: newAudit });
  } catch (err) {
    console.error("Error in createAudit:", err);
    res.status(500).json({ message: "Failed to create audit", error: err.message });
  }
};
export const getAudits = async (req, res) => {
  try {
    const userId = req.user.id;
    const audits = await Audit.find({ user: userId }).sort({ createdAt: -1 });
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audits." });
  }
};
