const Sequelize = require('sequelize');
const SupplierModel = require('../models/supplier');
const StateModel = require('../models/state');

/**
 * Función para crear un nuevo proveedor
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Proveedor (supplier.js), 
 *              Modelo Estado (state.js)
 */

const createSupplier = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            empresa,
            telefono,
            correo
        } = req.body;

        const stateSupplier = await StateModel.findOne({
            where: {
                nombre_estado: 'Activo'
            }
        });

        if (!stateSupplier) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        await SupplierModel.create({
            nombre,
            apellido,
            empresa,
            telefono,
            correo,
            ID_Estado_FK: stateSupplier.id
        });

        res.status(201).send({ msg: "Se ha registrado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El proveedor ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todos los proveedores
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Proveedor (supplier.js),
 *              Modelo Estado (state.js)
 */

const readSuppliers = async (req, res) => {
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
            const stateCustomer = await StateModel.findOne({
                where: {
                    nombre_estado: query.estado
                }
            });

            if (!stateCustomer) {
                return res.status(404).send({ error: "Estado no encontrado." });
            }

            where.ID_Estado_FK = {
                [Sequelize.Op.like]: `%${stateCustomer.id}%`
            }
        }

        const suppliers = await SupplierModel.findAll({
            where,
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (suppliers.length === 0) {
            return res.status(404).send({ error: "No hay proveedores." });
        }

        res.status(200).send({ suppliers });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver un proveedor por ID
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Proveedor (supplier.js),
 */

const readSupplierId = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await SupplierModel.findByPk(id, {
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (!supplier) {
            return res.status(404).send({ error: "Proveedor no encontrado." });
        }

        res.status(200).send({ supplier });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar un proveedor por ID
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Proveedor (supplier.js)
 */

const updateSupplierId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['nombre', 'apellido', 'telefono', 'correo'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const supplier = await SupplierModel.findByPk(id);

        if (!supplier) {
            return res.status(404).send({ error: "Proveedor no encontrado." });
        }

        updates.forEach((update) => supplier[update] = req.body[update]);

        await supplier.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar lógicamente a un proveedor por id
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Proveedor (supplier.js),
 *              Modelo Estado (state.js)
 */

const deleteSupplierId = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await SupplierModel.findByPk(id);

        if (!supplier) {
            return res.status(404).send({ error: "Proveedor no encontrado." });
        }

        const stateSupplier = await StateModel.findOne({
            where: {
                nombre_estado: "Inactivo"
            }
        });

        supplier.ID_Estado_FK = stateSupplier.id;
        await supplier.save();
        res.status(200).send({ msg: "Proveedor eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createSupplier,
    readSuppliers,
    readSupplierId,
    updateSupplierId,
    deleteSupplierId
};