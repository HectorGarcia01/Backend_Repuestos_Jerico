const transporter = require('./email');
const fs = require('fs');
const path = require('path');

const sendPurchaseDetail = async (destination) => {
    try {
        const pathHTML = path.join(__dirname, './public/views/purchase.html');
        const html = fs.readFileSync(pathHTML, 'utf8');

        const mailOptions = {
            from: "Venta de repuestos Jericó",
            to: destination,
            subject: "Tu compra ha sido registrada.",
            html
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = sendPurchaseDetail;