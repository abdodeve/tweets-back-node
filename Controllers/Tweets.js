const TweetsService = require("./../Services/TodoService");

/**
 * GET /api/tweets
 * Get All tweets
 */
exports.fetch = function (req, res) {
  //const tweets = TweetsService.fetch();
  res.json({ success: true, tweets: "works" });
};

/**
 * GET /api/tweets/:id
 * Get Single Tweets
 */
exports.single = function (req, res) {
  res.json({ success: true, tweets: "works" });
};

/**
 * POST /api/tweets
 * Create new Tweets
 */
exports.create = function (req, res) {
  res.json({ success: true, tweets: "works" });
};

/**
 * PUT /api/tweets
 * Update Tweets
 */
exports.update = function (req, res, next) {
  res.json({ success: true, tweets: "works" });
};

/**
 * DELETE /api/tweets
 * Delete Tweets
 */
exports.delete = function (req, res, next) {
  res.json({ success: true, tweets: "works" });
};
