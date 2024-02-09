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
  const length = password.length;
  let strength = 0;

  // Check if password contains lowercase letters
  const hasLowercase = /[a-z]/.test(password);
  // Check if password contains uppercase letters
  const hasUppercase = /[A-Z]/.test(password);
  // Check if password contains numbers
  const hasNumbers = /[0-9]/.test(password);
  // Check if password contains symbols
  const hasSymbols = /[!@#$%^&*()\-_=+{};:,<.>]/.test(password);

  // Add strength points based on presence of different character types
  if (length >= 8 && length <= 12) {
    strength += 1; // Increment strength for medium length
  } else if (length > 12) {
    strength += 2; // Increment strength for long length
  }

  if (hasLowercase) strength += 1;
  if (hasUppercase) strength += 1;
  if (hasNumbers) strength += 1;
  if (hasSymbols) strength += 1;

  return strength;
};


const StrengthIndicator = ({ strength }) => {
  let strengthLabel;
  let indicatorColor;
  let blockCount = 0; // Initialize block count

  // Determine strength label and indicator color based on strength level
  if (strength === 1) {
    indicatorColor = '#ff5252'; // Red color for weak
    strengthLabel = 'Weak';
    blockCount = 2; // Weak: Highlight first 2 blocks
  } else if (strength === 2) {
    indicatorColor = '#ffa500'; // Orange color for medium
    strengthLabel = 'Medium';
    blockCount = 3; // Medium: Highlight first 3 blocks
  } else {
    indicatorColor = '#4caf50'; // Green color for strong
    strengthLabel = 'Strong';
    blockCount = 4; // Strong: Highlight all 4 blocks
  }

  // Generate an array of spans with appropriate styling
  const blocks = Array.from({ length: 4 }).map((_, index) => (
    <span
      key={index}
      style={{ backgroundColor: index < blockCount ? indicatorColor : '#fff' }}
    ></span>
  ));

  return (
    <div className="strength-icon ml-1 flex items-center place-content-center flex-nowrap group">
      {blocks}
      <div className="strength-label">{strengthLabel}</div>
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
        {generatedPassword && ( // Show strength indicator only if a password is generated
          <div className="strength-indicator-wrap">
            <span>STRENGTH</span>
            <StrengthIndicator strength={passwordStrength} />
          </div>
        )}

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
