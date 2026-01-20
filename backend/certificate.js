import { Router } from "express";
import Certificate from "../models/certificate.js";

const router = Router();

router.post("/certificates", async (req, res) => {
  try {
    const { userName, auditDate, score, issuedTo } = req.body;
    const cert = new Certificate({ userName, auditDate, score, issuedTo });
    await cert.save();
    res.status(201).json({ message: "Certificate saved!", cert });
  } catch (err) {
    res.status(500).json({ message: "Failed to save certificate.", error: err.message });
  }
});

export default router;