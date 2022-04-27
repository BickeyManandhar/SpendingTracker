const express = require('express')
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("b24da6785adb04a15da43433762b199d4bacf41294bde1fc671372593ee4310e");

app.use(cors())

app.get('/getProducts', (req, res) => {
  const params = {
    q: req.query?.search ? req.query?.search : 'tv',
    tbm: "shop",
    location: "Dallas",
    hl: "en",
    gl: "us",
    tbs: req.query.filter,
  };
  const callback = function(data) {
    res.json(data)
  };
  search.json(params, callback);
})

app.get('/getFilters', (req, res) => {
  const params = {
    q: "tv",
    tbm: "shop",
    location: "Dallas",
    hl: "en",
    gl: "us"
  };
  const callback = function(data) {
    res.json(data['filters'])
  };
  search.json(params, callback);
})

const port = 7000
server.listen(port, () => console.log(`SERVER IS RUNNING ON PORT: ${port}`))
