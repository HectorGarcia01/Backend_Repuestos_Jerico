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

        const userToken = await user.generateAuthToken(user.id, nombre_rol);

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

/**
 * Función para cerrar sesión
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Token (token.js)
 */

const logout = async (req, res) => {
    try {
        const userToken = req.token;

        const removedToken = await TokenModel.destroy({
            where: {
                token_usuario: userToken
            }
        });

        if (removedToken === 0) {
            return res.status(404).send({ error: "Error al cerrar sesión." });
        }

        res.status(200).send({ msg: "Sesión cerrada correctamente." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para cerrar todas las sesiones
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Token (token.js)
 */

const logoutAll = async (req, res) => {
    try {
        const { user, role } = req;
        let removedToken;

        if (role === 'User') {
            removedToken = await TokenModel.destroy({
                where: {
                    ID_Cliente_FK: user.id
                }
            });
        } else {
            removedToken = await TokenModel.destroy({
                where: {
                    ID_Empleado_FK: user.id
                }
            });
        }

        if (removedToken === 0) {
            return res.status(404).send({ error: "Error al cerrar todas las sesiones." });
        }

        res.status(200).send({ msg: "Sesiones cerradas correctamente." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    login,
    logout,
    logoutAll
};