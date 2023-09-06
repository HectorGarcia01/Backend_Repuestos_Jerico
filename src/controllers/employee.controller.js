const Sequelize = require('sequelize');
const EmployeeModel = require('../models/employee');
const AddressModel = require('../models/address');
const RoleModel = require('../models/role');
const StateModel = require('../models/state');
const TokenModel = require('../models/token');

/**
 * Función para crear un nuevo empleado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Empleado (employee.js), 
 *              Modelo Direccion (address.js), 
 *              Modelo Rol (role.js), 
 *              Modelo Estado (state.js)
 *              Modelo Token (token.js)
 */

const createEmployee = async (req, res) => {
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

        const stateEmployee = await StateModel.findOne({
            where: {
                nombre_estado: 'Pendiente'
            }
        });

        if (!stateEmployee) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const roleEmployee = await RoleModel.findOne({
            where: {
                nombre_rol: 'Admin'
            }
        });

        if (!roleEmployee) {
            return res.status(404).send({ error: "Rol no encontrado." });
        }

        const addEmployee = await EmployeeModel.create({
            nombre,
            apellido,
            telefono,
            nit,
            correo,
            password,
            ID_Estado_FK: stateEmployee.id,
            ID_Rol_FK: roleEmployee.id
        });

        if (departamento || municipio || direccion_referencia) {
            await AddressModel.create({
                departamento,
                municipio,
                direccion_referencia,
                ID_Empleado_FK: addEmployee.id
            });
        }

        const token = await addEmployee.generateAuthToken(addEmployee.id, roleEmployee.nombre_rol);
        await TokenModel.create({
            token_usuario: token,
            ID_Empleado_FK: addEmployee.id
        });

        res.status(201).send({ msg: "Se ha registrado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El empleado ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver el perfil del empleado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Direccion (address.js)
 */

const readProfile = async (req, res) => {
    try {
        const { user } = req;

        const addressEmployee = await AddressModel.findOne({
            where: {
                ID_Empleado_FK: user.id
            }
        });

        res.status(200).send({ employee: user, addressEmployee });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del Empleado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Direccion (address.js)
 */

const updateEmployee = async (req, res) => {
    try {
        const { user } = req;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['nombre', 'apellido', 'telefono', 'nit', 'departamento', 'municipio', 'direccion_referencia'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        updates.forEach((update) => user[update] = req.body[update]);

        //Aún queda pendiente lo de actualizar la dirección ***********************************

        await user.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver todos los empleados
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Estado (state.js)
 */

const readEmployees = async (req, res) => {
    try {
        const employees = await EmployeeModel.findAll({});

        if (employees.length === 0) {
            return res.status(404).send({ error: "No hay empleados." });
        }

        res.status(200).send({ employees });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createEmployee,
    readProfile,
    updateEmployee,
    readEmployees
};