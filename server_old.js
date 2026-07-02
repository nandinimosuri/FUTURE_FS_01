const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Portfolio Backend Running");
});

app.post("/contact", (req, res) => {

    console.log("================================");
    console.log("NEW FORM SUBMISSION");
    console.log("Name:", req.body.name);
    console.log("Email:", req.body.email);
    console.log("Message:", req.body.message);
    console.log("================================");

    res.json({
        message: "Message Received Successfully"
    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});