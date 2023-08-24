const Sequelize = require('sequelize');
const CustomerModel = require('../models/customer');
const AddressModel = require('../models/address');
const RoleModel = require('../models/role');
const StateModel = require('../models/state');
const TokenModel = require('../models/token');

/**
 * Función para crear un nuevo cliente
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Direccion (address.js), 
 *              Modelo Rol (role.js), 
 *              Modelo Estado (state.js)
 *              Modelo Token (token.js)
 */

const createCustomer = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            telefono,
            nit,
            correo,
            password,
            departamento,
            municipio,
            direccion_referencia
        } = req.body;

        const stateCustomer = await StateModel.findOne({
            where: {
                nombre_estado: 'Pendiente'
            }
        });

        if (!stateCustomer) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const roleCustomer = await RoleModel.findOne({
            where: {
                nombre_rol: 'User'
            }
        });

        if (!roleCustomer) {
            return res.status(404).send({ error: "Rol no encontrado." });
        }

        const addCustomer = await CustomerModel.create({
            nombre,
            apellido,
            telefono,
            nit,
            correo,
            password,
            ID_Estado_FK: stateCustomer.id,
            ID_Rol_FK: roleCustomer.id
        });

        if (departamento || municipio || direccion_referencia) {
            await AddressModel.create({
                departamento,
                municipio,
                direccion_referencia,
                ID_Cliente_FK: addCustomer.id
            });
        }

        const token = await addCustomer.generateAuthToken(addCustomer.id, roleCustomer.nombre_rol);
        await TokenModel.create({
            token_usuario: token,
            ID_Cliente_FK: addCustomer.id
        });

        res.status(201).send({ msg: "Se ha registrado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El usuario ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el perfil del cliente
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Direccion (address.js)
 */

const readProfile = async (req, res) => {
    try {
        const { user } = req;

        const addressCustomer = await AddressModel.findOne({
            where: {
                ID_Cliente_FK: user.id
            }
        });

        res.status(200).send({ customer: user, addressCustomer });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createCustomer,
    readProfile
};