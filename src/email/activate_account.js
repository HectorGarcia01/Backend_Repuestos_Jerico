const transporter = require('./email');

const accountActivationEmail = async (destination, userToken) => {
    try {
        const mailOptions = {
            from: "Venta de repuestos Jericó",
            to: destination,
            subject: "Activación de cuenta de usuario.",
            text: `Token para activar tu cuenta: ${userToken}`
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    accountActivationEmail
};