const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
// Connect to MongoDB
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://mathiarasan2102:Mongodb_Mathi.2102@cluster0.tce2zo1.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const credential = mongoose.model('credential', {}, "bulkmail")

app.post('/sendmail', (req, res) => {

    // var msg = req.body.msg;
    // var emailList = req.body.emailList;

    var { msg, emailList, subject } = req.body;


    credential.find().then((data) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            }
        });


        new Promise(async (resolve, reject) => {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail({
                        from: 'mathiarasan.2102@gmail.com',
                        to: emailList[i],
                        subject: subject,
                        text: msg
                    });
                    console.log(`Email sent to ${emailList[i]}`);
                }
                resolve("Success");
            } catch (error) {
                reject("Failed");
            }
        }).then(() => {
            res.send(true);
        }).catch(() => {
            res.send(false);
        });


    }).catch((error) => {
        console.error('Error fetching data from MongoDB:', error);
    });

});
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
