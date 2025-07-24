const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;

const authEmail = async (req, res, next) => {
    try {
        const token = jwt.sign({ email: req.body.email }, JWT_SECRET, { expiresIn: '1h' });

        const transporter = nodemailer.createTransport({
            service: EMAIL_SERVICE,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: EMAIL_USER,
            to: req.body.email, 
            subject: 'Authentication Required',
            html: `
                <h1>Authenticate Your Email</h1>
                <p>Please click the link below to authenticate your email address:</p>
                <a href="https:tecora.azurewebsites.net/auth/verify?token=${token}">Verify Email</a>
                <br><br>
                <img src="https:tecora.azurewebsites.net/images/logo.png" alt="Logo" style="width: 100px; height: auto;">
            `,
            attachments: [
                {
                    filename: 'banner.png',
                    path: './path/to/your/image.png',
                    cid: 'unique@cid',
                },
            ],
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent: ${info.messageId}`);
        res.status(200).json({ message: 'Authentication email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send authentication email', error });
    }
};

module.exports = authEmail;
