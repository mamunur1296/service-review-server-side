const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const jwttoken = require("jsonwebtoken");
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
//jwt medelwore function
const jwtVarify = (req, res, next) => {
  const tokenInfo = req.headers.authorijation;
  if (!tokenInfo) {
    return res.status(401).send({ message: "unauthfffffffforijes" });
  }
  const token = tokenInfo.split(" ")[1];
  jwttoken.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(403).send({ message: "unauthorijes" });
    }
    req.decoded = decoded;
    next();
  });
};
const run = async () => {
  try {
    const services = client.db("assainment11").collection("services");
    const revews = client.db("assainment11").collection("revews");
    //get services
    app.get("/servises", async (req, res) => {
      const query = {};
      const data = await services
        .find(query)
        .sort({ time: "-1" })
        .limit(3)
        .toArray();
      res.send({
        message: true,
        data: data,
      });
    });
    //get all services
    app.get("/allservises", async (req, res) => {
      const query = {};
      const data = await services.find(query).sort({ time: "-1" }).toArray();
      res.send({
        message: true,
        data: data,
      });
    });
    //agate all reveow
    app.get("/allreveow", async (req, res) => {
      const query = {};
      const data = await revews
        .find(query)
        .sort({ time: "-1" })
        .limit(3)
        .toArray();
      res.send({
        message: true,
        data: data,
      });
    });
    //gate reveow by id
    app.get("/servicedetails/:id", async (req, res) => {
      const { id } = req.params;
      const data = await services.findOne({ _id: ObjectId(id) });
      res.send({
        message: true,
        data: data,
      });
    });
    //all reveow by id
    app.get("/allrevewsbyid/:id", async (req, res) => {
      const { id } = req.params;
      const data = await revews.findOne({ _id: ObjectId(id) });
      res.send(data);
    });
    //all reveow by id
    app.get("/allrevew/:id", async (req, res) => {
      const { id } = req.params;
      const quary = { revewId: id };
      const data = await revews.find(quary).sort({ postTime: "-1" }).toArray();
      res.send({
        message: true,
        data: data,
      });
    });
    //gate all reveow s
    app.get("/reveousbyemail", jwtVarify, async (req, res) => {
      const decoded = req.decoded.email;
      if (decoded !== req.query.email) {
        res.status(403).send({ message: "email paini" });
      }
      let quary = {};
      if (req.query.email) {
        quary = {
          userEmail: req.query.email,
        };
      }
      const data = await revews.find(quary).toArray();
      res.send({
        message: true,
        data: data,
      });
    });
    //post optine applay
    app.post("/poats", async (req, res) => {
      const data = req.body;
      const rejult = await services.insertOne(data);
      res.send(rejult);
    });
    //post reveow info
    app.post("/revewinfo", async (req, res) => {
      const data = req.body;
      const rejult = await revews.insertOne(data);
      res.send(rejult);
    });
    //JWT token apliex
    app.post("/jwttoken", async (req, res) => {
      const user = req.body;
      const token = jwttoken.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      res.send({
        message: true,
        data: token,
      });
    });
    //update info
    app.put("/updatereveow/:id", async (req, res) => {
      const { id } = req.params;
      const { body } = req;
      const quary = { _id: ObjectId(id) };
      const optins = { upsert: true };
      const updateData = {
        $set: {
          body: body.body,
        },
      };
      const rejult = await revews.updateOne(quary, updateData, optins);
      res.send(rejult);
    });
    //update post
    app.put("/updatepost/:id", async (req, res) => {
      const { id } = req.params;
      const { body } = req;
      const quary = { _id: ObjectId(id) };
      const optins = { upsert: true };
      const updateData = {
        $set: {
          body: body.body,
          title: body.title,
          photo: body.photo,
          price: body.price,
        },
      };
      const rejult = await services.updateOne(quary, updateData, optins);
      res.send(rejult);
    });
    //delete option instal
    app.delete("/deleterevew/:id", async (req, res) => {
      const { id } = req.params;
      const rejult = await revews.deleteOne({ _id: ObjectId(id) });
      res.send(rejult);
    });
    //delet post
    app.delete("/deletePost/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const rejult = await services.deleteOne({ _id: ObjectId(id) });
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
