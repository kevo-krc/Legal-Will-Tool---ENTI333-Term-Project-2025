
# Legal Will Generation Tool

## 📌 Overview
This project is a web-based application that helps users create legally valid wills for Canada and the USA. It uses **React** for the front end, **Node.js** for the backend, and **Supabase** for secure data storage. The app provides AI-guided questionnaires and generates non-editable PDF documents for wills and compliance assessments.

## 🎯 Goals
- Provide a free, accessible tool for legal will generation.
- Demonstrate AI-assisted legal document creation.
- Ensure secure data handling and privacy compliance.

## 🛠 Tech Stack
- **Frontend:** React
- **Backend:** Node.js
- **Database:** Supabase
- **Hosting:** Replit
- **Version Control:** GitHub

## 📂 Project Structure
Initial:
root/
├── README.md             # Project overview and instructions
├── LICENSE               # License information
├── .gitignore            # Ignored files and folders
├── PRD.md                # Product Requirements Document
├── Privacy_Policy.md     # Privacy policy for user data
├── Brand_Kit.html        # Visual branding reference
├── brand-kit.css         # Styles for Brand Kit HTML page
├── logo.png              # Project logo
├── project overview.txt  # Additional project notes
├── PROMPT_LOG.md         # Log of prompts and decisions
├── src/                  # React source files
│   ├── index.js
│   ├── App.js
│   ├── index.css

From Replit:
root/
/
├── public/
│   ├── Brand_Kit.html
│   ├── brand-kit.css
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── PrivacyPolicy.jsx
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── index.js
│   └── package.json
├── index.html
├── vite.config.js
├── package.json
└── replit.md

## 🚀 Getting Started
*(Setup instructions will be finalized after initial code commit)*
- Open Brand_Kit.html in your browser to view the visual branding reference
- Clone the repository
- Install dependencies
- Configure CSS
- Run the app

## ✅ Features *(to be expanded later)*
- AI-guided will creation
- Legal compliance check
- PDF generation and sharing
- Secure data storage
- User dashboard

## 🖼 Screenshots *(placeholder for future UI images)*
_Add screenshots of the dashboard and questionnaire flow here._

## 🔧 Usage Instructions *(to be added later)*
- How to register and log in
- How to create a will
- How to download and share documents
- How to manage personal data

## 🔑 Environment Variables *(placeholder)*
Document variables such as:

PRIVACY_POLICY_URL=https://yourdomain.com/privacy

## 🌐 API Endpoints *(placeholder for backend routes)*
- `/generate-will`
- `/generate-assessment`
- `/delete-data`

## 🔒 Privacy & Security
- All user data is stored securely in Supabase with encryption.
- Users can delete their data at any time.
- See ./Privacy_Policy.md for details.

## ⚠️ Error Handling *(placeholder for summary of recovery strategies)*
- Retry logic for AI failures
- Handling unsupported jurisdictions
- Email delivery fallback

## 🔮 Future Features
- Multi-language support
- Cross-border estate handling
- Mobile optimization

## 🙌 Acknowledgements *(placeholder)*
- University of Calgary
- Professor Mohammad Keyhani
- Tools: Replit, Supabase, React, Gemini, Co-Pilot

## 📄 License
This project is for academic purposes only and is not intended to provide legal advice.

## 👩‍💻 Author
Kevin Cooney – University of Calgary Term Project
