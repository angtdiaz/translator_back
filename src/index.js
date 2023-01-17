const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const responseTime = require("response-time");
const redis = require("redis");
const baseUrl = "https://text-translator2.p.rapidapi.com";
var config = require("./config.json");

app.use(responseTime());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const client = redis.createCluster({
  rootNodes: [
    {
      url: config.url,
    },
  ],
});
// client.connect();

client.on("connect", () => {
  console.log("Redis client is initiating a connection to the server.");
});

client.on("ready", () => {
  console.log("Redis client successfully initiated connection to the server.");
});

client.on("reconnecting", () => {
  console.log("Redis client is trying to reconnect to the server...");
});

client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/languages", async (req, res) => {
  const resp = await client.get("languages");

  if (resp) {
    console.log("get");
    return res.send(JSON.parse(resp));
  } else {
    const config = {
      headers: {
        "X-RapidAPI-Key": "11d2ae6882msh5eddf09838d1457p1a180bjsnaf61a6d68e70",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
    };
    const response = await axios.get(baseUrl + "/getLanguages", config);

    res.send(response.data);

    client.set("languages", JSON.stringify(response.data)).then(
      (value) => {
        console.log("set");
      },
      (err) => {
        console.error(err);
      }
    );
  }
});

app.post("/traslation", async (req, res) => {
  const key = req.body.text + "-" + req.body.target_language;

  const resp = await client.get(key);

  if (resp) {
    console.log("get");
    return res.send(JSON.parse(resp).data.translatedText);
  } else {
    const config = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "11d2ae6882msh5eddf09838d1457p1a180bjsnaf61a6d68e70",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
    };
    const response = await axios.post(baseUrl + "/translate", req.body, config);

    client.set(key, JSON.stringify(response.data)).then(
      (value) => {
        console.log("set");
        res.send(response.data);
      },
      (err) => {
        console.error(err);
      }
    );
  }
});

app.listen(3000);
console.log("Server listening on port 3000");
