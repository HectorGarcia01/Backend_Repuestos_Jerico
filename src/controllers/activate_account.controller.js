const jwt = require('jsonwebtoken');
const { KEY_TOKEN } = require('../config/config');
const CustomerModel = require('../models/customer');
const EmployeeModel = require('../models/employee');
const StateModel = require('../models/state');
const TokenModel = require('../models/token');
const welcomeEmail = require('../email/welcome_email');

/**
 * Función para activar una cuenta de usuario (cliente/empleado)
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Empleado (employee.js), 
 *              Modelo Estado (state.js),
 *              Modelo Token (token.js),
 *              Función para enviar un correo de bienvenida (welcome_email.js)
 */

const activateUserAccount = async (req, res) => {
    try {
        if (!req.header('Authorization')) {
            return res.status(400).send({ error: "Por favor envía un token." })
        }

        const userToken = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(userToken, KEY_TOKEN);

        const stateCustomer = await StateModel.findOne({
            where: {
                nombre_estado: 'Pendiente'
            }
        });

        const customer = await CustomerModel.findOne({
            where: {
                id: decodedToken.id,
                ID_Rol_FK: id,
                ID_Estado_FK: stateCustomer.id
            }
        });

        const user = customer || await EmployeeModel.findOne({
            where: {
                id: decodedToken.id,
                ID_Rol_FK: id,
                ID_Estado_FK: stateCustomer.id
            }
        });

        const validateToken = await TokenModel.findOne({
            where: {
                token_usuario: userToken
            }
        });

        if (!user || !validateToken) {
            return res.status(404).send({ error: "Token inválido." })
        }

        const newStateCustomer = await StateModel.findOne({
            where: {
                nombre_estado: 'Activo'
            }
        });

        user.ID_Estado_FK = newStateCustomer.id;
        await user.save();

        welcomeEmail(user.correo);
        res.status(200).send({ msg: "Tu cuenta ha sido activada, ya puedes iniciar sesión." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Función pendiente para que pueda generar un nuevo token de validación
//******************************************************************* */

module.exports = {
    activateUserAccount
};