const Sequelize = require('sequelize');
const CustomerModel = require('../models/customer');
const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality'); 
const RoleModel = require('../models/role');
const StateModel = require('../models/state');
const TokenModel = require('../models/token');

/**
 * Función para crear un nuevo cliente
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Cliente (customer.js), 
 *              Modelo Municipio (municipality.js), 
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
            direccion_referencia,
            correo,
            password,
            ID_Departamento_FK,
            ID_Municipio_FK
        } = req.body;

        if (ID_Municipio_FK) {
            const municipalityCustomer = await MunicipalityModel.findOne({
                where: {
                    id: ID_Municipio_FK,
                    ID_Departamento_FK
                }
            });

            if (!municipalityCustomer) {
                return res.status(404).send({ error: "Municipio no encontrado." });
            }
        }

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
            direccion_referencia,
            password,
            ID_Estado_FK: stateCustomer.id,
            ID_Rol_FK: roleCustomer.id,
            ID_Municipio_FK
        });

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
 */

const readProfile = async (req, res) => {
    try {
        const { user } = req;

        res.status(200).send({ customer: user });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver todos los clientes registrados
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const readCustomers = async (req, res) => {
    try {
        const customers = await CustomerModel.findAll({});

        if (customers.length === 0) {
            return res.status(404).send({ error: "No hay clientes." });
        }

        res.status(200).send({ customers });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del cliente
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Direccion (address.js)
 */

const updateCustomer = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Departamento_FK, ID_Municipio_FK } = req.body;
        const updates = Object.keys(req.body);

        const allowedUpdates = [
            'nombre', 
            'apellido', 
            'telefono', 
            'nit', 
            'direccion_referencia',
            'ID_Departamento_FK',
            'ID_Municipio_FK'
        ];

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        if (ID_Departamento_FK || ID_Municipio_FK) {
            const departmentCustomer = await DepartmentModel.findOne({
                where: {
                    id: ID_Departamento_FK
                }
            });

            const municipalityCustomer = await MunicipalityModel.findOne({
                where: {
                    id: ID_Municipio_FK,
                    ID_Departamento_FK
                }
            });

            if (!departmentCustomer || !municipalityCustomer) {
                return res.status(404).send({ error: "Departamento o Municipio no encontrado." });
            }
        }

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createCustomer,
    readProfile,
    readCustomers,
    updateCustomer
};