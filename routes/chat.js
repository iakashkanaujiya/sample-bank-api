const router = require("express").Router();
const path = require("path");
const dirname = path.join(__dirname, "../");

// Chat routes
router.get("/chat", (req, res) => {
    return res.status(200).sendFile(dirname + "/chat/index.html");
});

module.exports = router;

