const express = require("express");
const router = express.Router();
const path = require("path");

const dirname = path.join(__dirname, "/../");

router.get("/about", (req, res) => {
        return res.status(200).sendFile(dirname + "html/about.html");
});

router.get("/how-to-send-money-to-india", (req, res) => {
        return res.status(200).sendFile(dirname + "html/how-to-send-money-to-india.html");
});

router.get("/terms-and-conditions", (req, res) => {
        return res.status(200).sendFile(dirname + "html/terms-conditions.html");
});

module.exports = router;