import React, { useEffect, useState } from 'react';
import { authenticatedFetch, logout } from '../utils/auth';
import MainLayout from './mainlayout';
import SignupButton from '../components/signup/signup'; // ✅ Get Started button component
import VoiceInput from "../components/inputbar/inputbar";
import './dashboard.css';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false); // ✅ Controls input visibility

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        // const response = await authenticatedFetch('http://localhost:8000/api/user/profile/');
        // const data = await response.json();
        // setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="bg-black text-white min-h-screen flex justify-center items-center">
          Loading...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-container bg-black text-white min-h-screen p-6">
        <header className="dashboard-header flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="user-info flex gap-4 items-center">
            <span className="text-lg">Welcome, {username}!</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content space-y-6">
          <div className="card p-4 border border-gray-700 rounded">
            <h3 className="text-xl font-semibold">Your Account</h3>
            <p>Username: {username}</p>
          </div>

          {/* ✅ Conditional Welcome or VoiceInput */}
          {!showInput ? (
            <div className="welcome-message text-center">
              <h1 className="cursive-text text-4xl font-bold">Welcome to SpeakRight</h1>
              <h2 className="next-big-text text-2xl mt-2">English is A Journey</h2>
              <div className="signup-line-wrapper mt-2 mb-4">
                <p className="signup_line italic">To Talk Your Way to the Top!</p>
              </div>

              <SignupButton onClick={() => setShowInput(true)} /> {/* ✅ Toggles input */}
            </div>
          ) : (
            <div className="voice-input-wrapper mt-8">
              <VoiceInput /> {/* ✅ Voice Input component appears here */}
            </div>
          )}

          
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
