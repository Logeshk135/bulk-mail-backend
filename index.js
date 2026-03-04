const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Proper Schema
const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
});

const credential = mongoose.model("credential", credentialSchema, "bulkmail");

// ✅ MongoDB Connect (use your real URL)
mongoose.connect("mongodb+srv://Logesh:logesh123@cluster0.w2bo1zv.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Mongodb connected"))
.catch((err) => console.log("Mongodb connection failed", err));

app.get('/', (req, res) => {
    res.send("Server is running successfully 🚀");
});

app.post('/sendemail', async (req, res) => {

    try {
        const { msg, emailList } = req.body;

        const data = await credential.find();

        if (!data.length) {
            console.log("No credentials found in DB");
            return res.send(false);
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data[0].user,
                pass: data[0].pass,
            },
        });

        for (let i = 0; i < emailList.length; i++) {
            await transporter.sendMail({
                from: data[0].user,
                to: emailList[i],
                subject: "A message from bulkmail",
                text: msg,
            });

            console.log("Email sent to " + emailList[i]);
        }

        res.send(true);

    } catch (error) {
        console.log("EMAIL ERROR:", error);
        res.send(false);
    }
});

app.listen(5000, () => {
    console.log('Server is started');
});