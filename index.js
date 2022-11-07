const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
//meselWoore
app.use(cors());
app.use(express.json());
//mongo de conector

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnvnenk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    const services = client.db("assainment11").collection("services");

    const data = { mamun: "mamun" };
    const rejult = await services.insertOne(data);
    console.log(rejult);
  } finally {
  }
};
run().catch((err) => console.log(err));
//mongo db end
app.get("/", (req, res) => {
  client.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connect to mongodb");
    }
  });
  res.send("hall server");
});
app.listen(process.env.PORT || 5000, () => {
  console.log("this server is reantin PORT ", process.env.PORT);
});
