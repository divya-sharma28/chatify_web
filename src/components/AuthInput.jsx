import React from "react";

const AuthInput = ({ value, handleChange, labelText, name, Icon }) => {
  return (
    <div>
      <label className="auth-input-label">{labelText}</label>
      <div className="relative">
        <Icon className="auth-input-icon" />
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          className="input"
          placeholder={`Enter your ${labelText.toLowerCase()}`}
        />
      </div>
    </div>
  );
};

export default AuthInput;
