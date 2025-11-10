import express from "express";
import QuizLog from "../models/QuizLog.js";

const router = express.Router();

// 🟢 POST: Save quiz attempt
router.post("/", async (req, res) => {
  try {
    const newLog = new QuizLog(req.body);
    await newLog.save();
    res.status(201).json({ message: "✅ Quiz log saved successfully", newLog });
  } catch (error) {
    console.error("❌ Error saving quiz log:", error);
    res.status(500).json({ message: "Failed to save quiz log" });
  }
});

// 🟢 GET: Fetch all quiz logs
router.get("/", async (req, res) => {
  try {
    const logs = await QuizLog.find().sort({ _id: -1 });
    res.json(logs);
  } catch (error) {
    console.error("❌ Error fetching quiz logs:", error);
    res.status(500).json({ message: "Failed to fetch quiz logs" });
  }
});

export default router;
