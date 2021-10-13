/**
 * GET /api/tweets
 * Get All tweets
 */
exports.fetch = function (req, res) {
  res.json({ success: true, tweets: "works" });
};
