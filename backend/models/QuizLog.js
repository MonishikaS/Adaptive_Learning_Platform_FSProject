import mongoose from "mongoose";

const quizLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  subject: { type: String, required: true },
  mode: { type: String, required: true },
  question: { type: String, required: true },
  correct: { type: Boolean, required: true },
  cheated: { type: Boolean, default: false },
  timestamp: { type: String },
});

const QuizLog = mongoose.model("QuizLog", quizLogSchema);
export default QuizLog;
