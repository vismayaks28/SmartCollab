const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db"); 
const cors = require("cors");
const activityRoutes = require("./src/routes/activityRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./src/routes/authRoutes"));


app.use("/api/activity", activityRoutes);


app.use("/api/projects", projectRoutes);


app.use("/api/tasks", taskRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

