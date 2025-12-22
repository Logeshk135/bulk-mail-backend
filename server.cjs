const express = require("express");
const cors = require("cors");
const multer = require("multer")
const nodemailer = require("nodemailer");

 const app = express();

app.use(cors({
     origin: "https://bulk-mail-frontend-delta.vercel.app"
     }));

app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Excel upload API

app.post("/upload-excel", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file); // uploaded excel info

    res.json({ message: "Excel uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post('/sendemail', async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailList[i],
        subject: "A message from bulkmail",
        text: msg,
      });

      console.log("Email sent to", emailList[i]);
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
