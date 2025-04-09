# SpeakRight 
An AI-powered web application to enhance English speaking fluency and accuracy.

# Motivation  
Many individuals face challenges in articulating fluent and grammatically correct English, especially in professional and academic scenarios. Existing tools focus on written grammar correction but lack real-time voice interaction. SpeakRight addresses this gap by combining voice recognition with natural language processing to offer instant feedback on spoken English — aiming to boost confidence, clarity, and communication skills.

# Project Overview  
SpeakRight is a full-stack application that accepts spoken input, transcribes it in real time, checks the grammar using advanced AI models, and presents corrected results back to the user.

# Tech Stack  

- Frontend: React.js, Vite
- Backend: Django REST Framework  
- AI Models: Hugging Face (for grammar correction)  
- Speech Processing: Google Speech Recognition (for transcription)  
- Database: SQLite (for user data and authentication)

# Frontend Functionality  

- Built using React.js, the frontend provides an intuitive user experience.  
- Key components include:
  - Voice Input Module: Captures microphone input  
  - Transcription Display: Shows user’s speech as text  
  - Grammar Feedback: Displays corrected version of input  

# Backend Functionality  

- Developed in Django with Django REST Framework for RESTful APIs.  
- Backend handles:
  - User Authentication: Sign-up and sign-in using hashed passwords  
  - Speech-to-Text Processing: Uses Google’s speech recognition tools  
  - Grammar Analysis: Utilizes Hugging Face’s transformer models to correct grammar  

# Directory Structure Highlights

- `frontend/`: React components for UI, audio capture, result display  
- `backend/`: Django project containing:
  - `accounts/`: Manages user login/sign-up
  - `anlyzer/`: Handles transcription and correction APIs


# How to Run the Project  

1. Clone the Repository 
   `git clone https://github.com/Kathakali07/speakRight`

2. Backend Setup
   - Navigate to backend folder: `cd backend/`
   - Create a virtual environment and activate it
   - Install dependencies: `pip install -r requirements.txt`
   - Run the server: `python manage.py runserver`

3. Frontend Setup
   - Navigate to frontend folder: `cd frontend/`
   - Install dependencies: `npm install`
   - Start the frontend server: `npm start`

4. Ensure Both Servers Are Running 
   Open the application in browser via the frontend dev server (usually `http://localhost:3000/`)


#  Future Scope  

- Add pronunciation scoring with phoneme detection  
- Introduce real-time chatbot feedback for conversational practice  
- Support for multilingual speech evaluation  
- Track speaking improvements over time with analytics dashboard  



#  Why This Project Matters  

SpeakRight is not just a tool but a personal speaking coach. It bridges the gap between speech technology and language learning, making it a valuable assistant for job seekers, students, and professionals aiming to refine their communication skills.

