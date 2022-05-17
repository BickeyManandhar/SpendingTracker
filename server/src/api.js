const express = require('express')
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("febad527f654d0744e478f2189e0a440dcb7575037e8e9296fcd0363443956d4");
const router = express.router();
const serverless = require("serverless-http");

app.use(cors())

router.get('/getProducts', (req, res) => {
  const params = {
    q: req.query?.search ? req.query?.search : 'tv',
    tbm: "shop",
    location: "Queens County,New York,United States",
    hl: "en",
    gl: "us",
    tbs: req.query.filter,
  };
  const callback = function(data) {
    res.json(data)
  };
  search.json(params, callback);
})

router.get('/getFilters', (req, res) => {
  const params = {
    q: "tv",
    tbm: "shop",
    location: "Queens County,New York,United States",
    hl: "en",
    gl: "us"
  };
  const callback = function(data) {
    res.json(data['filters'])
  };
  search.json(params, callback);
})
app.use(`/netlify/function/api`, router);
module.exports = app;
module.exports.handler = serverless(app);


