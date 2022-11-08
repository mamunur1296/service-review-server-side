const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    app.get("/servises", async (req, res) => {
      const query = {};
      const data = await services.find(query).limit(3).toArray();
      res.send({
        message: true,
        data: data,
      });
    });
    app.get("/allservises", async (req, res) => {
      const query = {};
      const data = await services.find(query).toArray();
      res.send({
        message: true,
        data: data,
      });
    });
    app.get("/servicedetails/:id", async (req, res) => {
      const { id } = req.params;
      const data = await services.findOne({ _id: ObjectId(id) });
      res.send({
        message: true,
        data: data,
      });
    });
    app.post("/poats", async (req, res) => {
      const data = req.body;
      const rejult = await services.insertOne(data);
      res.send(rejult);
    });
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
