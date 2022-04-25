import express from 'express';
import got from 'got';
import cors from 'cors';

var router = express.Router();
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET");
    router.use(cors());
    next();
});

router.get('/', async function(req, res) {
  try {
    const browser = await got("http://localhost:8081/products");
    res.send(browser.body);
    console.log("Get products data");
  } catch (error) {
    console.log("Could not get data. Error: "+error.message);
    res.status(400).send("Wiremock server down.");
  }
});

router.get('/:id', async function (req, res) {
  try {
    const browser = await got("http://localhost:8081/products/"+req.params.id);
    res.send(browser.body);
    console.log("Get product data of id: "+req.params.id);
  } catch (error) {
    console.log("Could not get data. Error: "+error.message);
    res.status(400).send("Wiremock server down.");
  }
});

const app = express();
app.use('/products',router);

app.listen(4000, () =>
  console.log('Server is running.')
);