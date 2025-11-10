import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 🔐 Shared quiz log storage (temporary local)
let quizLogs = [];

function createFakeJwt(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const toBase64Url = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  return `${toBase64Url(header)}.${toBase64Url(payload)}.demo-signature`;
}

export default function AdaptiveDemo() {
  const [role, setRole] = useState(null);
  const [cheatedQuestions, setCheatedQuestions] = useState({});
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);

  // Restore previous role
  useEffect(() => {
    const savedRole = sessionStorage.getItem("userRole");
    if (savedRole) setRole(savedRole);
  }, []);

  // Password-protected login
  const login = (selectedRole) => {
    if (selectedRole === "Instructor" || selectedRole === "Admin") {
      const password = prompt("🔒 Enter password to access this portal:");
      if (password !== "CU123") {
        alert("❌ Incorrect password. Access denied.");
        return;
      }
    }
    const payload = { user: "demoUser", role: selectedRole, iat: Date.now() };
    createFakeJwt(payload);
    setRole(selectedRole);
    sessionStorage.setItem("userRole", selectedRole);
  };

  // Logout / Back
  const logout = () => {
    sessionStorage.removeItem("userRole");
    setRole(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setScore(0);
    setSelectedSubject(null);
    setSelectedMode(null);
    setCurrentQuestion(0);
  };

  // Cheating detection
 useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      setCheatedQuestions((prev) => ({
        ...prev,
        [currentQuestion]: true, // mark only this question as cheated
      }));
      alert("⚠️ Cheating detected on this question!");
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () =>
    document.removeEventListener("visibilitychange", handleVisibilityChange);
}, [currentQuestion]);


  // Question bank
  const questionBank = {
    English: [
      { q: "Identify the noun in: 'The cat sat on the mat.'", a: "cat", hint: "Naming word" },
      { q: "Synonym for 'happy'?", a: "joyful", hint: "Means cheerful" },
      { q: "Opposite of 'cold'?", a: "hot", hint: "Think warm" },
      { q: "Plural of 'child'?", a: "children", hint: "Irregular plural" },
      { q: "Adjective in: 'She is beautiful'?", a: "beautiful", hint: "Describes noun" },
    ],
    Maths: [
      { q: "5 + 7 = ?", a: "12", hint: "Add them" },
      { q: "8 * 6 = ?", a: "48", hint: "Multiply" },
      { q: "100 / 4 = ?", a: "25", hint: "Divide equally" },
      { q: "15 - 7 = ?", a: "8", hint: "Subtract smaller from larger" },
      { q: "9 squared = ?", a: "81", hint: "Multiply 9 by 9" },
    ],
    Java: [
      { q: "Who invented Java?", a: "James Gosling", hint: "Sun Microsystems" },
      { q: "Keyword for inheritance?", a: "extends", hint: "Subclass keyword" },
      { q: "JVM stands for?", a: "Java Virtual Machine", hint: "Runs bytecode" },
      { q: "Collection without duplicates?", a: "Set", hint: "Unique items" },
      { q: "Keyword for constant?", a: "final", hint: "Immutable variables" },
    ],
    "C++": [
      { q: "Who developed C++?", a: "Bjarne Stroustrup", hint: "Bell Labs" },
      { q: "File extension for C++?", a: ".cpp", hint: "Source file" },
      { q: "C++ is an extension of?", a: "C", hint: "Original language" },
      { q: "Polymorphism means?", a: "Many forms", hint: "Behavior change" },
      { q: "OOP concept in C++?", a: "Encapsulation", hint: "Data hiding" },
    ],
    C: [
      { q: "Who developed C?", a: "Dennis Ritchie", hint: "Bell Labs" },
      { q: "File extension for C?", a: ".c", hint: "Single character" },
      { q: "C is a ___ language?", a: "Procedural", hint: "Not OOP" },
      { q: "Header for printf()?", a: "stdio.h", hint: "I/O operations" },
      { q: "Default return of main()?", a: "int", hint: "Return type" },
    ],
    React: [
      { q: "What is JSX?", a: "JavaScript XML", hint: "Mix of JS and HTML" },
      { q: "Hook for state?", a: "useState", hint: "Starts with use" },
      { q: "Library React built on?", a: "JavaScript", hint: "Language base" },
      { q: "Starts app command?", a: "npm start", hint: "CLI command" },
      { q: "Virtual DOM helps with?", a: "Performance", hint: "Speeds updates" },
    ],
    HTML: [
      { q: "HTML stands for?", a: "HyperText Markup Language", hint: "Web foundation" },
      { q: "Tag for links?", a: "<a>", hint: "Anchor tag" },
      { q: "Tag for image?", a: "<img>", hint: "Displays image" },
      { q: "Tag for list?", a: "<ul>", hint: "Unordered list" },
      { q: "HTML is a ___ language?", a: "Markup", hint: "Not programming" },
    ],
    CSS: [
      { q: "CSS stands for?", a: "Cascading Style Sheets", hint: "For styling" },
      { q: "Property for text color?", a: "color", hint: "Font color" },
      { q: "Property for background?", a: "background-color", hint: "Area behind" },
      { q: "Selector for class?", a: ".", hint: "Dot notation" },
      { q: "Position fixed means?", a: "Stays", hint: "Does not scroll" },
    ],
  };

  // Start quiz
  const startQuiz = () => {
    if (!selectedMode) return alert("Please select a mode first!");
    if (!selectedSubject) return alert("Please select a subject first!");

    const questions = [...questionBank[selectedSubject]]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setQuizQuestions(questions);
    setQuizStarted(true);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setShowHint(false);
  };

  // Timer
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (quizStarted && timeLeft === 0) {
      setQuizCompleted(true);
      setQuizStarted(false);
      alert("⏰ Time's up! Quiz submitted.");
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  // Handle answer
  const handleAnswer = (answer) => {
    if (!quizQuestions[currentQuestion]) return;
    let points = score;
    let correct = false;

    if (answer.trim().toLowerCase() === quizQuestions[currentQuestion].a.toLowerCase()) {
      points += showHint ? 0.5 : 1;
      correct = true;
    }

    const log = {
  user: "Student",
  subject: selectedSubject,
  mode: selectedMode,
  question: quizQuestions[currentQuestion].q,
  correct,
  cheated: cheatedQuestions[currentQuestion] || false,
  timestamp: new Date().toLocaleTimeString(),
};


    quizLogs.push(log);
    setScore(points);

    // Save to backend MongoDB
    fetch("http://localhost:5000/api/quizlogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    }).catch((err) => console.error("❌ Error saving log:", err));

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion((p) => p + 1);
      setShowHint(false);
    } else {
      setQuizCompleted(true);
      setQuizStarted(false);
    }
  };

  const goBackToDashboard = () => {
    setQuizCompleted(false);
    setQuizStarted(false);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedSubject(null);
    setShowHint(false);
  };

  // ---------- UI ----------
  return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #8EC5FC, #E0C3FC)",
      fontFamily: "Poppins, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px",
    }}
  >
    {/* MAIN HEADER - stays centered everywhere */}
    <h1
      style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: "30px",
        textShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      🌐 Adaptive Learning Platform
    </h1>

    <div
      style={{
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "50px 60px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        width: "80%",
        maxWidth: "900px",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!role ? (
        <LoginScreen login={login} />
      ) : (
        <>
          <p style={{ color: "#10b981", fontWeight: "500" }}>
            ✅ Logged in as: <strong>{role}</strong>
          </p>

          <button
            onClick={logout}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              margin: "10px 0 20px 0",
              fontSize: "1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            🔙 Logout / Back
          </button>

          {role === "Instructor" ? (
            <InstructorConsole />
          ) : role === "Admin" ? (
            <AdminConsole />
          ) : !quizStarted && !quizCompleted ? (
            <StudentInterface
              startQuiz={startQuiz}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          ) : quizStarted ? (
            <QuestionInterface
              question={quizQuestions[currentQuestion]}
              onAnswer={handleAnswer}
              current={currentQuestion}
              total={quizQuestions.length}
              timeLeft={timeLeft}
              showHint={showHint}
              setShowHint={setShowHint}
            />
          ) : (
            <ResultScreen
              score={score}
              total={quizQuestions.length}
              startQuiz={startQuiz}
              goBackToDashboard={goBackToDashboard}
            />
          )}
        </>
      )}
    </div>
  </div>
);
}
// ---------- LOGIN SCREEN ----------
function LoginScreen({ login }) {
  const roles = [
    { role: "Student", color: "#4f46e5", desc: "Take adaptive quizzes.", emoji: "🧠" },
    { role: "Instructor", color: "#10b981", desc: "Monitor progress.", emoji: "👩‍🏫" },
    { role: "Admin", color: "#f59e0b", desc: "Analyze results.", emoji: "🧾" },
  ];
  return (
    <div style={{ textAlign: "center", marginTop: "15vh" }}>
      <h1>🎓 Welcome to Nimbus Adaptive Learning</h1>
      <p>Select your role to continue</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
        {roles.map((r) => (
          <div key={r.role} onClick={() => login(r.role)} style={{ cursor: "pointer", background: "white", borderRadius: "12px", padding: "25px 30px", width: "220px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <h2 style={{ color: r.color }}>{r.emoji} {r.role}</h2>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- STUDENT INTERFACE ----------

function StudentInterface({ startQuiz, selectedMode, setSelectedMode, selectedSubject, setSelectedSubject }) {
  const modes = [
    { name: "Diagnostic", desc: "Baseline quiz to gauge initial understanding" },
    { name: "Formative", desc: "Practice to strengthen weak concepts" },
    { name: "Summative", desc: "Checkpoint to test mastery" },
  ];

  const subjects = [
    { name: "English", icon: "📘" },
    { name: "Maths", icon: "🧮" },
    { name: "Java", icon: "☕" },
    { name: "C", icon: "💡" },
    { name: "C++", icon: "🔧" },
    { name: "React", icon: "⚛" },
    { name: "HTML", icon: "🌐" },
    { name: "CSS", icon: "🎨" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "70vh",
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(8px)",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        width: "70%",
        margin: "40px auto",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        🎯 Select Assessment Mode
      </h2>
      <p style={{ color: "#374151", fontSize: "1.05rem", marginBottom: "30px" }}>
        Choose how you want to begin your adaptive learning journey
      </p>

      {/* Mode Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "25px", justifyContent: "center" }}>
        {modes.map((m) => (
          <button
            key={m.name}
            onClick={() => setSelectedMode(m.name)}
            style={{
              padding: "20px 30px",
              width: "250px",
              background:
                selectedMode === m.name
                  ? "linear-gradient(135deg, #4f46e5, #9333ea)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow:
                selectedMode === m.name
                  ? "0 6px 20px rgba(79,70,229,0.5)"
                  : "0 3px 10px rgba(0,0,0,0.15)",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {m.name}
            <p
              style={{
                fontWeight: "400",
                fontSize: "0.9rem",
                marginTop: "6px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {m.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Subjects */}
      {selectedMode && (
        <>
          <h3 style={{ marginTop: "40px", fontSize: "1.5rem", color: "#1f2937", fontWeight: "600" }}>
            📚 Select Subject
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            {subjects.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedSubject(s.name)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    selectedSubject === s.name
                      ? "linear-gradient(135deg, #10b981, #34d399)"
                      : "white",
                  color: selectedSubject === s.name ? "white" : "#1f2937",
                  boxShadow:
                    selectedSubject === s.name
                      ? "0 6px 20px rgba(16,185,129,0.4)"
                      : "0 2px 6px rgba(0,0,0,0.1)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  if (selectedSubject !== s.name)
                    e.currentTarget.style.background = "rgba(229,231,235,0.6)";
                }}
                onMouseLeave={(e) => {
                  if (selectedSubject !== s.name)
                    e.currentTarget.style.background = "white";
                }}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "30px" }}>
            <button
              onClick={startQuiz}
              style={{
                padding: "12px 35px",
                background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                color: "white",
                fontWeight: "bold",
                borderRadius: "10px",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "transform 0.2s",
                boxShadow: "0 5px 20px rgba(147,51,234,0.4)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              🚀 Start Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
}


// ---------- QUESTION SCREEN ----------
function QuestionInterface({ question, onAnswer, current, total, timeLeft, showHint, setShowHint }) {
  const [input, setInput] = useState("");

  // Clear input when question changes
  useEffect(() => {
    setInput("");
  }, [question]);

  if (!question) return null;
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Question {current + 1} / {total}</h2>
      <p>{question.q}</p>
      <p style={{ color: "red" }}>⏰ Time Left: {timeLeft}s</p>
      {showHint ? (
        <p style={{
          background: "#fff3cd",
          border: "1px solid #ffeeba",
          padding: "10px",
          width: "60%",
          margin: "10px auto"
        }}>
          💡 Hint: {question.hint}
        </p>
      ) : (
        <button onClick={() => setShowHint(true)}>Show Hint (-0.5 pts)</button>
      )}
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your answer"
        />
        <button onClick={() => onAnswer(input)} style={{ marginLeft: "10px" }}>Submit</button>
      </div>
    </div>
  );
}


// ---------- INSTRUCTOR CONSOLE ----------
function InstructorConsole() {
  const [logs, setLogs] = useState([]);
  const refreshLogs = () => {
    fetch("http://localhost:5000/api/quizlogs")
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error("Error fetching logs:", err));
  };
  useEffect(refreshLogs, []);
  return (
    <div style={{ textAlign: "center" }}>
      <h2>📊 Instructor Dashboard</h2>
      <button onClick={refreshLogs} style={{ marginBottom: "10px", background: "#4f46e5", color: "white", borderRadius: "5px", padding: "5px 10px" }}>🔄 Refresh Data</button>
      {logs.length === 0 ? <p>No quiz data available yet.</p> : (
        <table border="1" cellPadding="8" style={{ margin: "20px auto", backgroundColor: "white" }}>
          <thead>
            <tr><th>Student</th><th>Mode</th><th>Subject</th><th>Question</th><th>Correct</th><th>Cheated</th><th>Time</th></tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{log.user}</td>
                <td>{log.mode}</td>
                <td>{log.subject}</td>
                <td>{log.question}</td>
                <td style={{ color: log.correct ? "green" : "red" }}>{log.correct ? "✅" : "❌"}</td>
                <td style={{ color: log.cheated ? "red" : "black" }}>{log.cheated ? "⚠️" : "No"}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------- ADMIN CONSOLE ----------
function AdminConsole() {
  const [logs, setLogs] = useState([]);
  const refreshLogs = () => {
    fetch("http://localhost:5000/api/quizlogs")
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error("Error fetching logs:", err));
  };
  useEffect(refreshLogs, []);

  const total = logs.length;
  const totalCorrect = logs.filter((q) => q.correct).length;
  const totalCheated = logs.filter((q) => q.cheated).length;
  const accuracy = total ? Math.round((totalCorrect / total) * 100) : 0;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>🧾 Admin Dashboard</h2>
      <button onClick={refreshLogs} style={{ background: "#4f46e5", color: "white", borderRadius: "5px", padding: "5px 10px", marginBottom: "10px" }}>🔄 Refresh</button>
      <p>Total Attempts: {total}</p>
      <p>Total Correct: {totalCorrect}</p>
      <p>Cheating Cases: {totalCheated}</p>
      <p>Accuracy Rate: {accuracy}%</p>
      <InstructorConsole />
    </div>
  );
}

// ---------- RESULT SCREEN ----------


function ResultScreen({ score, total, startQuiz, goBackToDashboard }) {
  const correct = score;
  const incorrect = total - correct;

  const data = [
    { name: "Correct", value: correct },
    { name: "Incorrect", value: incorrect },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const questionPerformance = Array.from({ length: total }, (_, i) => ({
    name: `Q${i + 1}`,
    Score: i < correct ? 1 : 0,
  }));

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        background: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(8px)",
        borderRadius: "16px",
        width: "80%",
        maxWidth: "900px",
        margin: "40px auto",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "15px", color: "#1f2937" }}>
        🎉 Quiz Completed!
      </h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#374151" }}>
        You answered <strong>{correct}</strong> out of <strong>{total}</strong>{" "}
        questions correctly.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "40px",
        }}
      >
        {/* PIE CHART */}
        <div style={{ width: "300px", height: "300px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div style={{ width: "400px", height: "300px" }}>
          <ResponsiveContainer>
            <BarChart data={questionPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Score" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <button
          onClick={startQuiz}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          🔁 Retake Quiz
        </button>
        <button
          onClick={goBackToDashboard}
          style={{
            backgroundColor: "#10b981",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          🏠 Go to Dashboard
        </button>
      </div>
    </div>
  );
}