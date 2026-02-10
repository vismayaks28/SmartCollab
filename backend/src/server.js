const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); 
const cors = require("cors");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.use("/api/auth", require("./routes/authRoutes"));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

