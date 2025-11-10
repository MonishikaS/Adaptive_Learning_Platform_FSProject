# 🌐 Adaptive Learning Platform  
> 🎓 *An intelligent MERN-based e-learning system with role-based access, adaptive quizzes, and cheating detection.*

---

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Tech](https://img.shields.io/badge/Stack-MERN-blueviolet.svg)
![Frontend](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Status](https://img.shields.io/badge/Version-1.0.0-orange)

---

## 🧠 Overview  

The **Adaptive Learning Platform** is a full-stack MERN project designed to provide a smart, secure, and adaptive online quiz experience.  
It customizes learning pathways for students while giving instructors and admins real-time insight into performance and engagement.  

Three key user roles define the system’s functionality:  
- 👨‍🎓 **Student:** Takes quizzes by choosing mode and subject.  
- 👩‍🏫 **Instructor:** Monitors quiz logs, performance, and cheating alerts.  
- 🧾 **Admin:** Analyzes global metrics like total attempts, accuracy rate, and cheating statistics.  

The project features **real-time cheating detection**, **result visualization**, and **MongoDB-powered data storage**.

---

## 🚀 Features  

| Feature | Description |
|----------|-------------|
| 🎯 **Adaptive Quiz Modes** | Diagnostic, Formative, and Summative assessment patterns |
| 🧩 **Dynamic Quiz Generation** | Randomized 5-question quizzes for each subject |
| ⏱️ **Timer Functionality** | 60-second countdown for each quiz session |
| ⚠️ **Cheating Detection** | Detects and logs tab-switching behavior |
| 📊 **Result Visualization** | Displays Pie & Bar charts using Recharts |
| 🔐 **Password Protection** | Instructor and Admin access via `CU123` |
| 💾 **MongoDB Integration** | Stores quiz data, timestamps, and cheat flags |
| 🎨 **Elegant UI** | Responsive purple-pink gradient theme with clear layout |

---

## 🧩 Tech Stack  

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | ![React](https://img.shields.io/badge/React.js-20232A?logo=react&logoColor=61DAFB) | Interactive user interface |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white) + ![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) | API and business logic |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white) | Quiz data and analytics storage |
| **Visualization** | ![Recharts](https://img.shields.io/badge/Recharts-FF6B6B?logo=recharts&logoColor=white) | Performance graphs and insights |
| **IDE** | ![VSCode](https://img.shields.io/badge/VS%20Code-0078d7.svg?logo=visual-studio-code&logoColor=white) | Development environment |

---

## ⚙️ Installation & Setup  

### 🧾 Prerequisites
Make sure you have installed:
- Node.js & npm
- MongoDB (local or Compass)
- Git
- VS Code

---

### 🪜 Steps

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/MonishikaS/Adaptive-Learning-Platform-FSProject.git
cd Adaptive-Learning-Platform-FSProject
```
2️⃣ Backend Setup
```
cd backend
npm install

PORT=5000
MONGO_URI=mongodb://localhost:27017/adaptiveDB

npm start
```
3️⃣ Frontend Setup
```
cd ../frontend
npm install
npm start
Then open: 👉 http://localhost:3000
```

🧮 System Flow
```
[START]
  ↓
Select Role → [Student | Instructor | Admin]
  ↓
IF Admin/Instructor → Prompt for Password (CU123)
  ↓
IF Student → Choose Mode & Subject → Attempt 5 Questions
  ↓
Detect Tab Switch → Mark as Cheated
  ↓
Store Results in MongoDB
  ↓
Show Charts & Analytics → Return to Dashboard
  ↓
[END]
```

💻 Role-wise Functionality
```
👨‍🎓 Student Portal

Select mode: Diagnostic / Formative / Summative

Choose subject (C, C++, Java, React, HTML, CSS)

Attempt quiz with timer and hints

View visual feedback (Pie & Bar charts)
```
👩‍🏫 Instructor Portal
```
Login using password: CU123

Access all student quiz logs from MongoDB

Detect cheating and monitor accuracy

🧾 Admin Portal

Login using password: CU123

View total attempts, accuracy rate, cheating cases

Analyze institute-wide performance
```
🖼️ Screenshots

1.Login page
<img width="847" height="391" alt="image" src="https://github.com/user-attachments/assets/002352b3-b5b0-4e39-93d8-ee77106119c3" />

2.Mode Selection (Diagnostic, Formative, Summative)
<img width="1018" height="870" alt="image" src="https://github.com/user-attachments/assets/c510bb39-aa87-4e8a-b991-2631c0dae443" />

3.Quiz Interface
<img width="1051" height="658" alt="image" src="https://github.com/user-attachments/assets/3913e9b1-f62f-49e9-bab8-8f3a363cd743" />

4.Result Page

<img width="753" height="630" alt="image" src="https://github.com/user-attachments/assets/0c2af573-6b70-44ca-9051-7fbe18133d5b" />

5.Instructor Dashboard

<img width="720" height="537" alt="image" src="https://github.com/user-attachments/assets/8627b9ef-829a-46dd-8ec7-01dc0f732bb6" />

6.Admin Dashboard
<img width="1048" height="622" alt="image" src="https://github.com/user-attachments/assets/66a05134-f4af-48ca-9f2e-721f4c532c26" />

7.Tab switches Dashboard
<img width="915" height="433" alt="image" src="https://github.com/user-attachments/assets/6b405c0f-8ad3-4920-9527-f05fbec1521d" />

8.MongoDB Dashboard
<img width="956" height="495" alt="image" src="https://github.com/user-attachments/assets/94eca70b-0c46-4580-a9fc-ef2aa6cba49b" />


🧠 Implementation Summary
```
Frontend built with React.js (Hooks, state, dynamic UI)

Backend APIs using Express.js

MongoDB for quiz log persistence

Data visualization via Recharts

Local state for user session tracking

Modular architecture for scalability
```
🛠️ Folder Structure
```
Adaptive-Learning-Platform/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```
🔮 Future Enhancements
```

🤖 AI-based adaptive question difficulty

📧 Email performance reports

☁️ Cloud-hosted MongoDB Atlas integration

🔒 JWT authentication for all roles

📊 Export analytics as PDF reports
```
📚 References
```
React.js Documentation

Express.js Guide

MongoDB Docs

Recharts Library
```
