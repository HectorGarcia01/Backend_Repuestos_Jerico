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
                nombre_estado: 'Activo'
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
            res.status(500).send({ error: error.message });
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
        const categories = await CategoryModel.findAll({
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (categories.length === 0) {
            return res.status(404).send({ error: "No hay categorías registradas." });
        }

        res.status(200).send({ categories });
    } catch (error) {
        res.status(500).send({ errr: "Error interno del servidor.", error });
    }
};

/**
 * Función para ver categorías por paginación
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js), 
 */

const readCategoriesPagination = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 6;

        const count = await CategoryModel.count();
        const categories = await CategoryModel.findAll({
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (categories.length === 0) {
            return res.status(404).send({ error: "No hay categorías registradas." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);

        res.status(200).send({ categories, currentPage: pageValue, totalPages });
    } catch (error) {
        res.status(500).send({ errr: "Error interno del servidor.", error });
    }
};

/**
 * Función para ver la categoría por id
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js)
 */

const readCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        res.status(200).send({ category });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar categoría por id
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js)
 */

const updateCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['nombre_categoria', 'descripcion_categoria'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        updates.forEach((update) => category[update] = req.body[update]);

        await category.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar lógicamente a una categoría por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Categoría (category.js),
 *              Modelo Estado (state.js)
 */

const deleteCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        const stateCategory = await StateModel.findOne({
            where: {
                nombre_estado: "Inactivo"
            }
        });

        category.ID_Estado_FK = stateCategory.id;
        await category.save();
        res.status(200).send({ msg: "Categoría eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createCategory,
    readCategories,
    readCategoriesPagination,
    readCategoryId,
    updateCategoryId,
    deleteCategoryId
};