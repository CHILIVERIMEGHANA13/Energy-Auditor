import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  energyUsed: Number,
  appliances: Number,
  areaSqft: Number,
  buildingType: String,
  hvacAgeYears: Number,
  score: Number,
  certificate: {
    id: String,
    timestamp: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Audit = mongoose.model('Audit', auditSchema);
export default Audit;
