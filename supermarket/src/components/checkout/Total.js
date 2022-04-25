import React from "react";

import "./Total.css";

// component for each total in the list

const Total=({total}) => {

	return (
		<div className="total-container">
			<div className="total-title">
				{total.name}
			</div>

			<div className="total-value-container">
				£ {Number(total.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
			</div>
		</div>
	);
};

export default Total;