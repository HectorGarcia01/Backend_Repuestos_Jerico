const Sequelize = require('sequelize');
const categoryModel = require('../models/category');

/**
 * Función para Registrar una nueva categoría
 * Fecha creación: 05/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Categoría (category.js), 
 */

const addCategory = async (req, res) => {
    try {
        const { nombre_categoria } = req.body;

        const newCategory = await categoryModel.create(nombre_categoria);

        res.status(201).send({ msg: "Se ha registrado una nueva categoría.", newCategory })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El usuario ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

module.exports = {
    addCategory
};