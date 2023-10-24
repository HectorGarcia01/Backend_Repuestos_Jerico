const Sequelize = require('sequelize');
const EmployeeModel = require('../models/employee');
const RoleModel = require('../models/role');
const StateModel = require('../models/state');
const TokenModel = require('../models/token');

/**
 * Función para crear un nuevo empleado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Empleado (employee.js), 
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
            password
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
 */

const readProfile = async (req, res) => {
    try {
        res.status(200).send({ employee: req.user });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del Empleado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Empleado (employee.js)
 */

const updateEmployee = async (req, res) => {
    try {
        const { user } = req;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['nombre', 'apellido', 'telefono', 'nit'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        updates.forEach((update) => user[update] = req.body[update]);

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
        const { query } = req;
        const where = {};

        if (query.nombre) {
            where.nombre = {
                [Sequelize.Op.like]: `%${query.nombre}%`
            };
        }

        if (query.apellido) {
            where.apellido = {
                [Sequelize.Op.like]: `%${query.apellido}%`
            };
        }

        if (query.telefono) {
            where.telefono = {
                [Sequelize.Op.like]: `%${query.telefono}%`
            };
        }

        if (query.nit) {
            where.nit = {
                [Sequelize.Op.like]: `%${query.nit}%`
            };
        }

        if (query.correo) {
            where.correo = {
                [Sequelize.Op.like]: `%${query.correo}%`
            };
        }

        if (query.estado) {
            const stateEmployee = await StateModel.findOne({
                where: {
                    nombre_estado: query.estado
                }
            });

            if (!stateEmployee) {
                return res.status(404).send({ error: "Estado no encontrado." });
            }

            where.ID_Estado_FK = stateEmployee.id
        }

        const employees = await EmployeeModel.findAll({
            where,
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (employees.length === 0) {
            return res.status(404).send({ error: "No se encontraron empleados que coincidan con los criterios de búsqueda." });
        }

        res.status(200).send({ employees });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver un empleado por ID
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 */

const readEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeModel.findByPk(id);

        if (!employee) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }

        res.status(200).send({ employee });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar lógicamente a un empleado por id
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Estado (state.js)
 */

const deleteEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeModel.findByPk(id);

        if (!employee) {
            return res.status(404).send({ error: "Empleado no encontrado." });
        }

        const stateEmployee = await StateModel.findOne({
            where: {
                nombre_estado: "Inactivo"
            }
        });

        employee.ID_Estado_FK = stateEmployee.id;
        await employee.save();
        res.status(200).send({ msg: "Empleado eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createEmployee,
    readProfile,
    updateEmployee,
    readEmployees,
    readEmployeeId,
    deleteEmployeeId
};