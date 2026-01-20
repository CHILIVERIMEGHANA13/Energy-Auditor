import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Web3 from 'web3';
import CertificateABI from './blockchain/Certificate.json' assert { type: 'json' };


import Audit from './models/audit.js';
import dashboardRoutes from './routes/dashboard.js';
import adminAuthRoutes from './routes/adminAuth.js';
import authRoutes from './routes/auth.js';
import auditRoutes from './routes/audits.js';

dotenv.config();
import certificatesRouter from "./routes/certificate.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Blockchain setup
const web3 = new Web3("http://127.0.0.1:8545");
const CONTRACT_ADDRESS = "0x690F87B3A2cB02007E697580Beeaad543b90BEf6";
const SENDER_ADDRESS = "0x9ecF90B13210e139495a50F1d0d721D469639082"; // ⚠️ REPLACE with Ganache account address
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const contract = new web3.eth.Contract(CertificateABI.abi, CONTRACT_ADDRESS);

// Middleware
app.use(json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/api", certificatesRouter);
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/audits', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Energy Auditing Backend is live ⚡');
});

app.post("/audit/submit", async (req, res) => {
  try {
    const { userId, buildingName, buildingLocation, buildingType, energyUsage } = req.body;

    if (!userId || !buildingName || !buildingLocation || !buildingType || !energyUsage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const auditId = "AUD" + uuidv4().slice(0, 8).toUpperCase();
    const efficiencyScore = Math.max(100 - energyUsage / 10, 0);

    const certificate = {
      id: auditId,
      timestamp: new Date().toISOString(),
    };

    const certHash = web3.utils.keccak256(JSON.stringify(certificate));

    const tx = contract.methods.storeCertificate(auditId, certHash);
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
        chainId: 5777,
      },
      PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    const newAudit = new Audit({
      auditId,
      userId,
      buildingName,
      buildingLocation,
      buildingType,
      energyUsage,
      efficiencyScore,
      certificateIssued: true,
      certificateOnChain: {
        id: certificate.id,
        timestamp: certificate.timestamp,
        hash: certHash,
        txHash: receipt.transactionHash
      }
    });

    await newAudit.save();

    res.status(201).json({
      message: "Audit + blockchain cert saved successfully ✅",
      auditId,
      txHash: receipt.transactionHash,
      score: efficiencyScore,
    });
  } catch (err) {
    console.error("🔥 Error submitting audit:", err);
    res.status(500).json({ message: "Server error while submitting audit" });
  }
});

// Error handling middleware
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing token' });
    const token = authHeader.split(' ')[1];
    // Verify token here
});


// MongoDB Connection
connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (process.env.NODE_ENV === 'development') process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  if (process.env.NODE_ENV === 'development') process.exit(1);
});

app.post('/audits', async (req, res) => {
  console.log('Received audit:', req.body);
  try {
    const newAudit = new AuditModel(req.body);
    const savedAudit = await newAudit.save();
    console.log('Saved audit:', savedAudit);
    res.status(201).json({ audit: savedAudit });
  } catch (err) {
  console.error('Error saving audit:', err);
   res.status(500).json({ message: 'Failed to save audit' });
  }
});