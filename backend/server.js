const express = require("express");
const cors = require("cors");
const db = require("./db");

db.init();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/users", require("./routes/users"));

app.get("/", (req, res) => res.send("AI Business Analytics API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
