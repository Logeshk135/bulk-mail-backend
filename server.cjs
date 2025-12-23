const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: "https://bulk-mail-frontend-delta.vercel.app/sendemail",   // later restrict to frontend URL
  methods: ["GET", "POST"]
}));
app.use(express.json());

// ===== DB MODEL =====
const credential = mongoose.model("credential", {}, "bulkmail");

// ===== MONGODB CONNECT =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));

// ===== ROUTE =====
app.post("/sendemail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    if (!msg || !emailList || emailList.length === 0) {
      return res.status(400).json(false);
    }

    const data = await credential.findOne();
    if (!data) return res.status(500).json(false);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data.user,
        pass: data.pass, // APP PASSWORD
      },
    });

    for (const email of emailList) {
      await transporter.sendMail({
        from: data.user,
        to: email,
        subject: "A message from BulkMail",
        text: msg,
      });

      console.log("Sent:", email);
    }

    res.json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json(false);
  }
});

// ===== PORT =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
