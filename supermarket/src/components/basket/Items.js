import React from "react";

import Item from "./Item";

// component for item list

const Items=({items, updateItem, operateMode}) => {
	return (
		<>
			{items.map(function(item,index) {
				return (
					<Item 
						index={index}
						key={item.id}
						item={item}
						updateItem={updateItem}
						operateMode={operateMode} 
					/>
				)
			})}
		</>
	)
};

export default Items;