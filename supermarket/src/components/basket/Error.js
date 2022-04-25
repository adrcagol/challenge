import React from "react";
import "./Error.css";

const Error=({errorTitle,errorDescr}) => {
	return (
		<div className="error-container">
			<div className="error-title">{errorTitle}</div>
			<div className="error-descr">{errorDescr}</div>
		</div>
	);
};

export default Error;