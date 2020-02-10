const express = require("express");
const app = express();
const port = 5051;
const url = require("url");

// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.use(async function(req, res, next) {
  if (req.url.startsWith("/_data")) {
    await sleep(1000);
  }

  next();
});

// This is what serves things from the 'served/_data' folder
app.use(express.static("served"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/article/:id", (req, res) => {
  // // eslint-disable-next-line
  // console.log(
  //   "|",
  //   req.protocol,
  //   req.get("host"),
  //   `_data/articles/${req.params.id}`,
  //   "|"
  // );
  // // eslint-disable-next-line
  // console.dir(url);

  res.send({
    msg: `You requested article: ${req.params.id}`,
    article: {
      text: `This is pretty ${req.params.id}`,
      img: url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: `_data/articles/${req.params.id}.jpg`
      })
    }
  });
});

// eslint-disable-next-line
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
