const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;

// Socket.io connection
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// DB Connection
mongoose.connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
}).then((result) => {
    console.log("Successfully connected to DB");
}).catch((err) => {
    console.log(err);
    console.log("There is an error, connecting with the Database");
});

// Socket.io
io.on("connection", (socket) => {
    console.log("User is connected");
    socket.on("chat", (message) => {
        console.log("Payload", message);
        io.emit("chat", message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// API Routes
const routes = require("./routes");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const bankRoutes = require("./routes/banking");
const chatRoutes = require("./routes/chat");

app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/banking", bankRoutes);
app.use("/api", chatRoutes);


server.listen(PORT, () => {
    console.log(`Server started on the PORT ${PORT}`);
});