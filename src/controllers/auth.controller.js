const CustomerModel = require('../models/customer');
const EmployeeModel = require('../models/employee');
const RoleModel = require('../models/role');
const TokenModel = require('../models/token');

/**
 * Función para iniciar sesión
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Empleado (employee.js), 
 *              Modelo Rol (role.js),
 *              Modelo Token (token.js)
 */

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const customerBuild = CustomerModel.build();
        const employeeBuild = EmployeeModel.build();

        const customer = await customerBuild.findByCredentials(correo, password);
        const user = customer || await employeeBuild.findByCredentials(correo, password);

        if (!user) {
            return res.status(401).send({ error: "Credenciales inválidas." });
        }

        const { nombre_rol } = await RoleModel.findOne({
            where: {
                id: user.ID_Rol_FK
            }
        });

        const userToken = await user.generateAuthToken(user.id, Nombre_Rol);

        if (nombre_rol === 'User') {
            await TokenModel.create({
                token_usuario: userToken,
                ID_Cliente_FK: user.id
            });
        } else {
            await TokenModel.create({
                token_usuario: userToken,
                ID_Empleado_FK: user.id
            });
        }

        res.status(200).send({ user, userRole: nombre_rol, userToken });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

module.exports = {
    login
};