import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './signupform.css';

function SignupForm({ onSwitchToSignin, onSignUpSuccess }) {
  const [dob, setDob] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('You must agree to the Terms and Conditions.');
      return;
    }
    onSignUpSuccess();
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="User name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />

          <DatePicker
            selected={dob}
            onChange={(date) => setDob(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Date of Birth"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date()}
            required
            className="custom-datepicker"
          />

          <select required>
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer-not-say">Prefer not to say</option>
          </select>

          <input type="text" placeholder="Location (City, Country)" required />

          <label className="terms-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
            />
            I agree to the <a href="#" className="terms-link">Terms and Conditions</a>
          </label>


          <button type="submit">Sign up</button>
        </form>

        <div className="login-text">
          Already have an account? <span onClick={onSwitchToSignin}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
