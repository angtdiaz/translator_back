const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const responseTime = require("response-time");
const redis = require("redis");
const baseUrl = "https://text-translator2.p.rapidapi.com";

app.use(responseTime());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});
client.connect();

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

    res.send(response.data);

    client.set(key, JSON.stringify(response.data)).then(
      (value) => {
        console.log(value);
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
