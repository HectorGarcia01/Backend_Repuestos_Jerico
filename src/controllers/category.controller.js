const Sequelize = require('sequelize');
const CategoryModel = require('../models/category');
const StateModel = require('../models/state');

/**
 * Función para Registrar una nueva categoría
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Categoría (category.js), 
 *              Modelo Estado (state.js)
 */

const createCategory = async (req, res) => {
    try {
        const { nombre_categoria, descripcion_categoria } = req.body;

        const stateCategory = await StateModel.findOne({
            where: {
                Tipo_Estado: 'Activo'
            }
        });

        if (!stateCategory) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const newCategory = await CategoryModel.create({ 
            nombre_categoria, 
            descripcion_categoria,
            ID_Estado_FK: stateCategory.id
        });

        res.status(201).send({ msg: "Se ha registrado una nueva categoría.", newCategory })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡La categoría ya existe!" });
        } else {
            res.status(500).send({ errors: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todas las categorías
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js), 
 */

const readCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll({});

        if (categories.length === 0) {
            return res.status(404).send({ error: "No hay categorías registradas." });
        }

        res.status(200).send({ categories });
    } catch (error) {
        res.status(500).send({ errr: "Error interno del servidor.", error });
    }
};

module.exports = {
    createCategory,
    readCategories
};