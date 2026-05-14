# Future Students — HITU Academic Portal

> A smart academic portal for Computer Science students at Helwan International Technological University

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat\&logo=html5\&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat\&logo=css3\&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat\&logo=javascript\&logoColor=black) ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat\&logo=chartdotjs\&logoColor=white)

## About the Project

Future Students is a complete educational platform built entirely with Vanilla JavaScript — without any framework or backend — allowing CS students to track their grades, communicate with classmates, and improve their technical skills.

## Features

| Feature               | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| Authentication System | Login and personal accounts using localStorage                       |
| Student Dashboard     | Display grades and GPA across 6 subjects with interactive bar charts |
| Student Management    | 312 students across 8 sections with instant search                   |
| AI Chatbot            | Smart assistant powered by Groq API — LLaMA 3 70B                    |
| Reports               | Charts for grade distribution and subject averages                   |
| 13 Color Themes       | Full appearance customization using CSS Variables                    |
| Skills Section        | 24 recommended skills categorized by level                           |

## Project Structure

```text
students-future/
├── index.html          # Landing Page
├── login.html          # Login and Registration
├── home.html           # Home Page
├── dashboard.html      # Main Dashboard
├── my-dashboard.html   # Personal Student Dashboard
├── subjects.html       # Courses
├── students.html       # Students List
├── skills.html         # Recommended Skills
├── reports.html        # Academic Reports
├── chatbot.html        # AI Assistant
├── profile.html        # User Profile
├── settings.html       # Settings and Themes
├── config.js           # API Configuration
├── css/                # Styling Files
├── js/                 # JavaScript Files
└── data/students.js    # Students Database
```

## Running the Project

```bash
git clone https://github.com/username/future-students.git
cd future-students
```

Open `index.html` directly in the browser — no server required.

## AI Chatbot Setup

1. Get a free API key from Groq Console
2. Open `config.js` and add your key:

```js
GROQ_API_KEY: "your_api_key_here"
```

## Technologies

* Frontend: HTML5, CSS3, Vanilla JavaScript
* Charts: Chart.js 4.4
* AI: Groq API — LLaMA 3 70B
* Fonts: Google Fonts (Cairo + Orbitron)
* Storage: localStorage / sessionStorage

## Developer

Full Stack Developer
Helwan International Technological University — HITU
