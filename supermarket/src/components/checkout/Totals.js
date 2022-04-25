import React from "react";

import Total from "./Total";
import Button from "./Button";

// componente for total and buttons list

const Totals=({totals, operateMode, operationExec}) => {

  const TotalsDiv = () => {
    return (
      <>
        <h2>Expected Totals</h2>  
        <div className="totals-container-show" >
          {totals.totalPromos>0 
            ? <Total total={{name: "Raw Total:", value: totals.totalProducts}}/>
            : <Total total={{name: "Total:", value: totals.totalProducts}}/>
          }           
          <Total total={{name: "Total Promos:", value: totals.totalPromos}}/>
          <Total total={{name: "Total Payable:", value: totals.totalProducts-totals.totalPromos}}/>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="totals-button-container">
        {operateMode.mode===0
            ? <>
                <TotalsDiv />
              </>
            : null
        }
        {operateMode.mode===1 && operateMode.state===0
            ? <div>
                <Button onClick={() => operationExec(1,operateMode)}>Checkout</Button>
              </div>
            : null
        }
        {operateMode.mode===1 && operateMode.state===1
            ? <>
                <div className="totals-button-container">
                    <div>
                        <Button onClick={() => operationExec(0,operateMode)}>Keep Buying</Button>
                    </div>
                </div>
                <TotalsDiv />
              </>
            : null
        }
          
      </div>
    </>
  )   
}

export default Totals;
