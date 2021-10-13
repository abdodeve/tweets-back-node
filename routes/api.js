const Tweets = require("../Controllers/Tweets");

module.exports = function (express) {
  var router = express.Router();

  /*
    |--------------------------------------------------------------------------
    |  Tweets Routes
    |--------------------------------------------------------------------------
    */
  router.get("/tweets", Tweets.fetch);
  router.get("/tweets/:id", Tweets.single);
  router.post("/tweets", Tweets.create);
  router.put("/tweets/:id", Tweets.update);
  router.delete("/tweets/:id", Tweets.delete);

  return router;
};
