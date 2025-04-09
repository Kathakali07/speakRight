import React, { useEffect, useState } from 'react';
import { authenticatedFetch, logout } from '../utils/auth';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get username from localStorage (set during login)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Example of using authenticatedFetch - replace with your actual API endpoint
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // This is just an example - you would replace with your actual protected endpoint
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
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {username}!</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        <h2>Welcome to your dashboard!</h2>
        <p>You are successfully logged in with JWT authentication.</p>
        
        {/* Your dashboard content goes here */}
        <div className="card">
          <h3>Your Account</h3>
          <p>Username: {username}</p>
        </div>
        
        <div className="card">
          <h3>What's Next?</h3>
          <ul>
            <li>Build your dashboard features</li>
            <li>Implement user profile management</li>
            <li>Add more protected routes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;