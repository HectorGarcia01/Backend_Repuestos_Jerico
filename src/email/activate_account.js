const transporter = require('./email');
const ejs = require('ejs');
const path = require('path');

const accountActivationEmail = async (destination, userToken) => {
    try {
        const html = await ejs.renderFile(path.join(__dirname, 'views/activate_account.ejs'), { userToken });
        const mailOptions = {
            from: "Venta de repuestos Jericó",
            to: destination,
            subject: "Activación de cuenta de usuario.",
            html
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    accountActivationEmail
};