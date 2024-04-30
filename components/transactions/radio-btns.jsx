import React, { useState } from "react";

const RadioBtn = ({ value, label, checked, onChange }) => {
  return (
    <div>
      <input
        type="radio"
        name="recipientAddress"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  );
};

export default RadioBtn;
