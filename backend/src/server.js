const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db"); 

const app = express();

connectDB();

app.use(express.json());


const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);


app.listen(5000, () => {
    console.log("Server running on port 5000");
});

