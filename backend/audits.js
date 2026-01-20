import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import Audit from "../models/audit.js";
import verifyToken from "../middleware/verifyToken.js";
import { calculateEfficiencyScoreBE } from "../utils/efficiencyCalculator.js";
import Web3 from "web3";
import CertificateABI from '../blockchain/Certificate.json' assert { type: 'json' };
import authMiddleware from "../middleware/authMiddleware.js";
import { createAudit } from "../controllers/auditController.js";
import { getAudits } from "../controllers/auditController.js";
const router = Router();

const web3 = new Web3("http://127.0.0.1:8545"); 
const CONTRACT_ADDRESS = "0x690F87B3A2cB02007E697580Beeaad543b90BEf6"; // Replace with your deployed contract address
const PRIVATE_KEY = process.env.PRIVATE_KEY; // 👈 Use a .env file for your deployer's wallet
const PROVIDER_URL = "http://127.0.0.1:7545"; // Ganache or Infura URL
const contract = new web3.eth.Contract(CertificateABI.abi, CONTRACT_ADDRESS);
// POST: /api/audits
router.post("/", authMiddleware, createAudit); 

router.get("/audits", verifyToken, getAudits);
router.post("/audits", verifyToken, async (req, res) => {
  try {
    const formData = req.body;
     const userId = req.user.id;
    if (!formData.buildingType || !formData.areaSqft || !formData.hvacAgeYears) {
      return res.status(400).json({ message: "Missing required audit fields." });
    }

    const score = calculateEfficiencyScoreBE(formData);
    const certificateId = uuidv4();
    const timestamp = new Date().toISOString();

    const certificate = {
      id: certificateId,
      timestamp,
    };

    // Create hash from certificate
    const certHash = web3.utils.keccak256(JSON.stringify(certificate));

    // Prepare tx data
    const tx = contract.methods.storeCertificate(certificateId, certHash);
    const gas = await tx.estimateGas({ from: SENDER_ADDRESS });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(SENDER_ADDRESS);

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: CONTRACT_ADDRESS,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: 5777, // Change this to your chain's ID if not Ganache
      },
      PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Blockchain Tx Receipt:", receipt);

    const newAudit = new Audit({
      user: req.user.id,
      energyUsed: formData.energyUsed,
      appliances: formData.appliances,
      area: formData.areaSqft,
      score,
      certificate,
      createdAt: new Date(),
    });

    await newAudit.save();
    res.status(201).json({ message: "Audit saved + blockchain entry complete!", audit: newAudit });
  } catch (err) {
    console.error("Web3 audit error:", err);
    res.status(500).json({ message: "Blockchain storage failed." });
  }
});
export default router;
