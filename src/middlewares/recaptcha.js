const axios = require('axios');
const { RECAPTCHA } = require('../config/config');

/**
 * Middleware de recaptcha v3
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const verifyRecaptcha = (req, res, next) => {
    try {
        const secretKey = RECAPTCHA;
        const { token } = req.body;

        if (!token) {
            return res.status(400).send({ success: false, error: "Token no proporcionado." });
        }

        axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: secretKey,
                response: token,
            },
        }).then(response => {
            const recaptchaResponse = response.data;
            if (recaptchaResponse.success) {
                next();
            } else {
                res.status(403).send({ success: false, error: "Token no válido" });
            }
        }).catch(error => {
            res.status(500).send({ success: false, error: "Error en la verificación" });
        });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = verifyRecaptcha;