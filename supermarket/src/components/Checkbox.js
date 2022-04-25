import React from "react";
import "./Checkbox.css";

const Checkbox = ({label, index, checked, onChange}) => {
	return (
		<div className="check-container">
		<input id="myCheck" type="checkbox" checked={checked} onChange={onChange}></input>
		<label>{label}</label>
		</div>    
	);
};

export default Checkbox;