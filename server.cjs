const express = require("express");
const cors = require("cors");
const multer = require("multer")
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const credential = mongoose.model("credential", {}, "bulkmail");

 const app = express();

app.use(cors());
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

mongoose.connect("mongodb+srv://Logesh:logesh123@cluster0.w2bo1zv.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error", err));



app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post('/sendemail', (req, res) => {

    var msg = req.body.msg;
    var emailList = req.body.emailList;

    credential.find().then(function (data) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async (resolve, reject) => {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "logeshk135@gmail.com",
                            to: emailList[i],
                            subject: "A message from bulkmail",
                            text: req.body.msg,
                        }
                    )

                    console.log("Email sent to " + emailList[i])

                }

                resolve("success");

            }
            catch (error) {
                reject("Failed");
            }
        }).then(function () {
            res.send(true);
        }).catch(function () {
            res.send(false);
        });

    }).catch(function (error) {
        console.log(error);
    });


})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
