import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import Items from "./components/basket/Items";   
import Error from "./components/basket/Error";
import Totals from "./components/checkout/Totals";
import Button from "./components/checkout/Button";
import Checkbox from "./components/Checkbox";

function App() {
  const [totals, setTotals] = useState({"totalProducts": 0, "totalPromos": 0});  // store totals
  const [operateMode, setOperateMode] = useState({"mode": 0, "state": 2});  // operateMode.mode {0: automatic calculate, 1: checkout calculate}
                                                                            // operateMode.state {0: add products to checkout, 
                                                                            //                    1: at checkout, 
                                                                            //                    2: automatic calculate,
                                                                            //                    9: error }
  const [items, setItems] = useState([]);   // store products data
  const [counter, setCounter] = useState(0); // set counter
  const [counterActive, setCounterActive] = useState(false); // status counter 
  const [errorMsg, setErrorMsg] = useState({title: "", descr: ""});  

  useEffect(() => {   // load data and make initial settings
    fetchData(0);
    setCounterActive(true);
    setCounter(60);
  }, []);

  useEffect(() => {  // counter controller
    let displayCounterId;

    if (counterActive) {
      displayCounterId = setInterval(() => {
        setCounter(counter-1);
      }, 1000);

      if (counter===0) {
        updateTimer();
      }
    }
    return () => clearInterval(displayCounterId);
  }, [counterActive, counter]);

  const updateTimer = () => {  // run the update and restart counting
    setCounter(60);
    setCounterActive(true);
    operationExec(2,operateMode);
  }

  const updateItem=(itemId, newItem) => {  // update item at items list
    const newItems = items.map(item => {
       if (item.id===itemId) return newItem;
        return item;
      });
    setItems(newItems);

    calcTotal(newItems);
  }

  const fetchData = async(op) => {   // fetch data from api
    // op {
    //   0: fetch products and reset quantities
    //   1: fetch products and keep quantities
    //   2: fetch only data for products with quantity>0
    // }

    var result = [];
    if (op<2){  // fetch products list
      await axios.get("http://localhost:4000/products")
        .then(response => {
          result = response.data;
        })
        .catch(error => {
          console.log("Erro fetching data: ", error);
          setErrorMsg({"title": "Error connecting to API", "descr": error.message});
          operationExec(9,operateMode);
        })
    } else {
      result = items;
    }

    for (let item of result) {
      if (op<2) {  // set or initialize quantity for each item
        let index = items.findIndex( (element) => item.id === element["id"]);

        if (index>=0) {  // existing product
          if (op===0) {item["qty"] = 0;}   // reset quantity
          else {item["qty"] = items[index].qty;}  // get stored quantity
        } else {  // new product
          item["qty"] = 0;
          item["promotions"] = [];
        }
        item["price"] = item["price"]/100;
      }

      if (operateMode.state>0) { // if not in "add products to checkout" state
        if (op!==2 || item.qty>0) {  // fetch data for all products or only with quantitys > 0
          let data = await fetchDataProducts(item.id);

          data["promotions"].price = data["promotions"].price/100;

          item["promotions"] = data["promotions"];
        }
      }
    }

    setItems(result);

    calcTotal(result);

    return true;
  }

  const fetchDataProducts = async(itemId) => {  // fetch data for product with id
    let result = [];
    await axios.get("http://localhost:4000/products/"+itemId)
        .then(response => {
          result = response.data;
        })
        .catch(error => {
          console.log("Erro fetching data: ", error);
          setErrorMsg({"title": "Error connecting to API", "descr": error.message});
          operationExec(9,operateMode);
        })
    return result;
  }

  const calcTotal = (auxItems) => {
    var totalProducts = 0;
    var totalPromos = 0;
    if (operateMode.state>0) {  // if not in "add products to checkout" state
      for (let item of auxItems) {
        if (item.qty>0) {
          var item_total = (item.price * item.qty);
          totalProducts += item_total;

          var promo_item = 0;
          for (let promotion of item.promotions) {
            if (promotion.type.toUpperCase()==="QTY_BASED_PRICE_OVERRIDE") {
              let aux_qty = item.qty;
              let aux_promo_item = 0;
              while (aux_qty>=promotion.required_qty) {
                aux_promo_item += (item.price*promotion.required_qty - promotion.price/100);
                aux_qty -= promotion.required_qty;
              }
              if (aux_promo_item>promo_item) {promo_item=aux_promo_item;}

            } else if (promotion.type.toUpperCase()==="BUY_X_GET_Y_FREE") {
              let aux_qty = item.qty;
              let aux_promo_item = 0; 
              while (aux_qty>=promotion.required_qty) {
                aux_promo_item += (promotion.free_qty*item.price);
                aux_qty -= promotion.required_qty;
              }
              if (aux_promo_item>promo_item) {promo_item=aux_promo_item;}
            
            } else if (promotion.type.toUpperCase()==="FLAT_PERCENT") {
              let aux_promo_item = (item_total*promotion.amount/100); 
              if (aux_promo_item>promo_item) {promo_item=aux_promo_item;}
            }
          }
          totalPromos += promo_item;
        }
      }
    }
    setTotals({"totalProducts": totalProducts, "totalPromos": totalPromos});
    return true;
  };

  function operationExec(op,operateMode) {  // performs system operations checking mode and state
    // op {
    //   0: zera e volta para o início
    //   1: checkout
    //   2: update data
    //   3: done (volta para o estado inial)
    //   9: loading data error
    // }

    let newOperateMode = operateMode;
    if (op===0) {
      newOperateMode.state = 0;
      setOperateMode(newOperateMode);
      setTotals({"totalProducts": 0, "totalPromos": 0});
      setCounterActive(false);
    } else if (op===1) {
      newOperateMode.state = 1;
      setOperateMode(newOperateMode);
      fetchData(2);
    } else if (op===2) {
      newOperateMode.state = operateMode.mode===0 ? 2 : 0;
      setOperateMode(newOperateMode);
      fetchData(1);
      setCounter(60);
      setCounterActive(operateMode.mode===0);
    } else if (op===3) {
      newOperateMode.state = operateMode.mode===0 ? 2 : 0;
      setOperateMode(newOperateMode);
      fetchData(0);
      setTotals({"totalProducts": 0, "totalPromos": 0});
      setCounter(60);
      setCounterActive(operateMode.mode===0);
    } else if (op===9) {
      newOperateMode.state = 9;
      setOperateMode(newOperateMode);
      setTotals({"totalProducts": 0, "totalPromos": 0});
      setCounterActive(false);
    }
  }

  const onCheckboxChangeAU = () => {
    let newOperateMode = operateMode;
    newOperateMode.mode = 0;
    setOperateMode(newOperateMode);
    operationExec(2,newOperateMode);
  }

  const onCheckboxChangeUC = () => {
    let newOperateMode = operateMode;
    newOperateMode.mode = 1;
    setOperateMode(newOperateMode);
    operationExec(2,newOperateMode);
  }   
  
  return (
    <>
      <div className="config-container">
        <div className="operate-container">
          <label>Operation Mode:</label>
          <Checkbox label={"Automatic Calculation and Update"} checked={operateMode.mode===0} onChange={onCheckboxChangeAU}/>
          <Checkbox label={"Calculation at Checkout"} checked={operateMode.mode===1} onChange={onCheckboxChangeUC}/>
        </div>
        {/* <Counter counter={count} /> */}
        <div className="counter-container"> 
          { counterActive 
            ? <label>Update Data on
            :</label> : null 
          }
          <div>
            { counterActive 
              ? <label>{counter} seconds</label> 
              : null 
            }
          </div>
        </div>
        
      </div>
    
      <div className="app">

        <div className="basket-container">
          <h2>My Basket</h2>
          <p>Enter the quantity of each item</p>
          <div>
            { operateMode.state !== 9 
              ? <Items items={items} updateItem={updateItem} operateMode={operateMode}/>
              : <Error errorTitle={errorMsg.title} errorDescr={errorMsg.descr}/>
            }
          </div>
        </div>
        <div className="totals-container">
                  
          <Totals totals={totals} operateMode={operateMode} operationExec={operationExec}/>
    
          <div className="totals-button-container">
            <div>
              <Button onClick={()=> operationExec(3,operateMode)}>Done</Button>
              <Button onClick={()=> operationExec(3,operateMode)}>Clear the Basket</Button>
              <Button onClick={()=> operationExec(2,operateMode)}>Update Data</Button>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}

export default App;
