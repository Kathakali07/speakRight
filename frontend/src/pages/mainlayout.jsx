import React, { useRef } from 'react';
import Navbar from '../components/navbar/navbar'; 
import { FaLinkedin, FaGithub, FaDiscord } from "react-icons/fa";

function MainLayout({ children }) {
  const contactRef = useRef(null);

  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Navbar */}
      <Navbar onContactClick={scrollToContact} />

      {/* Page-specific content */}
      <div className="main-content">
        {children}
      </div>

      {/* Mission & Vision */}
      <div id="mission-vision" className="mission-vision-section">
        <p>
          At SpeakRight, we believe that effective communication is the key to success,
          and everyone deserves to speak with confidence. Whether you're preparing for a speech,
          presentation, or simply want to improve your everyday communication, SpeakRight helps
          you speak clearly, confidently.
          Join us and transform your voice into a powerful tool for success, one confident step at a time!
        </p>
      </div>

      {/* Centered poetic text */}
      <div className="centered-text">
        <p>At SpeakRight, your confidence will soar,</p>
        <p>With tools and support, you'll fear no more.</p>
      </div>

      {/* Contact Us */}
      <div ref={contactRef} id="contact-us" className="contact-us-section">
        <h2>Contact Us</h2>
        <div className="team-icons">
          <div className="team-member">
            <img src="team1.jpg" alt="Member 1" className="team-pic" />
            <p>JANNATUN KHUSBU</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/jannatun-khusbu-32a8282a7/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} />
              </a>
              <a href="https://github.com/janna-collab" target="_blank" rel="noopener noreferrer">
                <FaGithub size={30} />
              </a>
              <a href="https://discordapp.com/users/jannatun_khusbu_01_30321" target="_blank" rel="noopener noreferrer">
                <FaDiscord size={30} />
              </a>
            </div>
          </div>
          <div className="team-member">
            <img src="team2.jpg" alt="Member 2" className="team-pic" />
            <p>SATYAM PUITANDY</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/satyam-puitandy-477271340?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} />
              </a>
              <a href="https://github.com/puitandysatyam" target="_blank" rel="noopener noreferrer">
                <FaGithub size={30} />
              </a>
              <a href="https://discord.gg/eWmgxJ4C " target="_blank" rel="noopener noreferrer">
                <FaDiscord size={30} />
              </a>
            </div>
          </div>
          <div className="team-member">
            <img src="team3.jpg" alt="Member 3" className="team-pic" />
            <p>KATHAKALI DAS</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/kathakali-kd-46a93623b" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} />
              </a>
              <a href="https://github.com/Kathakali07" target="_blank" rel="noopener noreferrer">
                <FaGithub size={30} />
              </a>
              <a href="https://discordapp.com/users/meebhaalo6700" target="_blank" rel="noopener noreferrer">
                <FaDiscord size={30} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;
