require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

app.post('/send', (req, res) => {
    const { name, email, comment } = req.body;

    if (!name || !email || !comment) {
        return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.MAIL_USER, 
        subject: `Новое сообщение от ${name}`,
        text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${comment}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ошибка при отправке письма' });
        }
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Сообщение отправлено!' });
    });
});


app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

