const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const { default: axios } = require('axios');
require('dotenv').config(); // load env variables

const app = express();

app.use(cors({
  origin: ["https://bulk-mail-frontend-delta.vercel.app"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});


app.post('/sendmail', (req, res) => {

    var msg = req.body.msg;
    var emailList = req.body.emailList;

    credential.find().then(function (data) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
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
    console.log(`Server is running on port ${PORT}`);
});
