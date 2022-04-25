import React from "react";

import "./Item.css";

// component for each product item in the list

const Item=({index, item, updateItem, operateMode}) => {
	const handleQtyChange = (e) => {
		item.qty = e.target.value;
		updateItem(item.id, item);
	}

	const handleQtyBlur = () => {
		updateItem(item.id, item);
	}

	return (
		<div className="item-container" style={item.qty>0 ? {borderLeft: "8px solid  lightskyblue"}: {borderLeft: "8px solid #444"}}>
			<div className="item-title">
				<div>{item.name}</div>
				<div className="item-price">£ {item.price}</div>
			</div>

			<div className="item-qty-container">
				<label>quantity:
					<input 
						type="number" 
						name="item-qty" 
						id="item-qty" 
						min="0" 
						max="999"
						onChange={handleQtyChange}
						onBlur={handleQtyBlur}
						value={item.qty}
						disabled={operateMode.state===1}
					/>
				</label>    
			</div>
		</div>
	);
};

export default Item;