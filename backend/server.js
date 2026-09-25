const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db"); 
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);


app.use("/api/activity", activityRoutes);


app.use("/api/projects", projectRoutes);


app.use("/api/tasks", taskRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

