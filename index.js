const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const credential = mongoose.model("credential", {}, "bulkmail");

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://Logesh:logesh123@cluster0.w2bo1zv.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("Mongodb connected");
}).catch(function () {
    console.log("Mongodb connection failed");
})


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



app.listen(5000, () => {
    console.log('Server is started');
});