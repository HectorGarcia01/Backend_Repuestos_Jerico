const Sequelize = require('sequelize');
const ProductLocationModel = require('../models/product_location');
const StateModel = require('../models/state');

/**
 * Función para registrar una nueva ubicación de estantería
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Ubicacion_Producto (product_location.js), 
 *              Modelo Estado (state.js)
 */

const createProductLocation = async (req, res) => {
    try {
        const { nombre_estanteria } = req.body;

        const stateProductLocation = await StateModel.findOne({
            where: {
                nombre_estado: 'Activo'
            }
        });

        if (!stateProductLocation) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        await ProductLocationModel.create({
            nombre_estanteria,
            ID_Estado_FK: stateProductLocation.id
        });

        res.status(201).send({ msg: "Se ha registrado una nueva ubicación." })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡La ubicación ya existe!" });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
};

/**
 * Función para ver todas las ubicaciones de estanterías
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Ubicacion_Producto (product_location.js), 
 *              Modelo Estado (state.js)
 */

const readProductLocation = async (req, res) => {
    try {
        const productLocation = await ProductLocationModel.findAll({
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (productLocation.length === 0) {
            return res.status(404).send({ error: "No hay ubicaciones de productos registradas." });
        }

        res.status(200).send({ productLocation });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver ubicación de estantería por id
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Ubicacion_Producto (product_location.js), 
 *              Modelo Estado (state.js)
 */

const readProductLocationId = async (req, res) => {
    try {
        const { id } = req.params;
        const productLocation = await ProductLocationModel.findByPk(id, {
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (!productLocation) {
            return res.status(404).send({ error: "Marca de producto no encontrada." });
        }

        res.status(200).send({ productLocation });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createProductLocation,
    readProductLocation,
    readProductLocationId
};