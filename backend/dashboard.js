import { Router } from 'express';
const router = Router();
import Audit from '../models/audit.js'; 

router.get('/stats/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const audits = await find({ userId });

    const totalAudits = audits.length;
    const certificates = audits.filter(a => a.certificateIssued).length;
    const avgEfficiency = audits.length
      ? (audits.reduce((sum, a) => sum + a.efficiencyScore, 0) / audits.length).toFixed(1)
      : 0;

    res.json({
      totalAudits,
      certificates,
      avgEfficiency,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
