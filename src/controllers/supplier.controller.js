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

module.exports = {
    createSupplier
};