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
            telefono,
            correo
        } = req.body;

        const stateSupplier = await StateModel.findOne({
            where: {
                Tipo_Estado: 'Activo'
            }
        });

        if (!stateSupplier) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        await SupplierModel.create({
            nombre,
            apellido,
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
        const suppliers = await SupplierModel.findAll({});

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
        const supplier = await SupplierModel.findByPk(id);

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

module.exports = {
    createSupplier,
    readSuppliers,
    readSupplierId
};