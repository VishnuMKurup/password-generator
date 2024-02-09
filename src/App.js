import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  IconButton,
} from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';
import './App.css'; // Ensure that you have this file in your project

const generatePassword = (
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_-+=<>?/';

  let characters = '';
  if (includeUppercase) characters += uppercaseChars;
  if (includeLowercase) characters += lowercaseChars;
  if (includeNumbers) characters += numberChars;
  if (includeSymbols) characters += symbolChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

const calculatePasswordStrength = (password) => {
  if (password.length < 6) {
    return 1; // Weak
  } else if (password.length >= 6 && password.length <= 12) {
    return 2; // Medium
  } else {
    return 3; // Strong
  }
};

const StrengthIndicator = ({ strength }) => {
  let indicatorColor;
  let strengthLabel;

  if (strength === 1) {
    indicatorColor = '#ff5252'; // Red color for weak
    strengthLabel = 'Weak';
  } else if (strength === 2) {
    indicatorColor = '#ffa500'; // Orange color for medium
    strengthLabel = 'Medium';
  } else {
    strengthLabel = 'Strong';
    indicatorColor = '#4caf50'; // Green color for strong
  }

  return (
    <div className="strength-indicator" data-strength={strength} style={{ color: indicatorColor }}>
      <div className="strength-label">{strengthLabel}</div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={`strength-block ${index < strength ? 'filled' : ''}`} />
      ))}
    </div>
  );
};

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div className="notification-container">
      <div className="notification">{message}</div>
    </div>
  );
};

function App() {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleGeneratePassword = () => {
    const password = generatePassword(
      passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    );
    setGeneratedPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleCopyToClipboard = () => {
    // Copy to clipboard
    navigator.clipboard.writeText(generatedPassword);

    // Show notification
    setNotification('Password copied to clipboard!');
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="app-container">
      <div className="generated-password-container-top">
        <Typography variant="h6" gutterBottom>
          Generated Password
        </Typography>
        {generatedPassword && (
          <div className="generated-password-box">
            <span>{generatedPassword}</span>
            <IconButton
              onClick={handleCopyToClipboard}
              color="primary"
              aria-label="Copy to Clipboard"
            >
              <FileCopyOutlined />
            </IconButton>
            {notification && (
              <Notification message={notification} onClose={closeNotification} />
            )}
          </div>
        )}
      </div>

      <div className="password-settings-container">
        <Typography variant="h4" gutterBottom>
          Password Settings
        </Typography>
        <div className='password-range'>
          <input
            type="range"
            min="1"
            max="25"
            value={passwordLength}
            onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
          />
          <span className='password-length'>{passwordLength}</span>
        </div>
        <div className="input-container">
          <FormControlLabel
            control={
              <Checkbox
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(!includeUppercase)}
                color="secondary"
              />
            }
            label="Uppercase"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeLowercase}
                onChange={() => setIncludeLowercase(!includeLowercase)}
                color="secondary"
              />
            }
            label="Lowercase"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
                color="secondary"
              />
            }
            label="Numbers"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
                color="secondary"
              />
            }
            label="Symbols"
          />
        </div>
        <div className="strength-indicator-wrap">
          <span>STRENGTH</span>
          <StrengthIndicator strength={passwordStrength} />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGeneratePassword}
        >
          Generate Password
        </Button>
      </div>
    </div>
  );
}

export default App;
