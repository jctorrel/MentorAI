import React from "react";

function InputBar({ value, onChange, onSubmit, disabled }) {
  return (
    <form className="input-bar" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Pose ta question : organisation, cours, alternance, révisions..."
        autoComplete="off"
        required
        value={value}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        <span className="icon">➜</span>
        <span>{disabled ? "En cours..." : "Envoyer"}</span>
      </button>
    </form>
  );
}

export default InputBar;
