const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const CONTACTS_FILE = path.join(__dirname, "contacts.json");

function saveContact(contact) {
    let contacts = [];
    try {
        if (fs.existsSync(CONTACTS_FILE)) {
            const data = fs.readFileSync(CONTACTS_FILE, "utf8");
            contacts = data ? JSON.parse(data) : [];
        }
    } catch (err) {
        console.error("Failed reading contacts file:", err);
    }

    contacts.push(contact);

    try {
        fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf8");
    } catch (err) {
        console.error("Failed writing contacts file:", err);
        throw err;
    }
}

app.get("/", (req, res) => {
    res.send("Working");
});

app.post("/contact", (req, res) => {

    console.log("================================");
    console.log("NEW FORM SUBMISSION");
    console.log("Name:", req.body.name);
    console.log("Email:", req.body.email);
    console.log("Message:", req.body.message);
    console.log("================================");

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    const submission = {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    try {
        saveContact(submission);
        res.json({
            message: "Message Received Successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to save message"
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

