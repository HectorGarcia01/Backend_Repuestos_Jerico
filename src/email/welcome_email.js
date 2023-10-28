const transporter = require('./email');
const fs = require('fs');
const path = require('path');

const welcomeEmail = async (destination) => {
    try {
        const pathHTML = path.join(__dirname, 'views/welcome.html');
        const html = fs.readFileSync(pathHTML, 'utf8');

        const mailOptions = {
            from: "Venta de repuestos Jericó",
            to: destination,
            subject: "Tu cuenta ha sido verificada.",
            html
        };
        
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = welcomeEmail;