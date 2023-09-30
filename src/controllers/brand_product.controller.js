const Sequelize = require('sequelize');
const ProductBrandModel = require('../models/brand_product');
const StateModel = require('../models/state');

/**
 * Función para registrar una nueva marca de producto
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Marca de Producto (brand_product.js), 
 *              Modelo Estado (state.js)
 */

const createProductBrand = async (req, res) => {
    try {
        const { nombre_marca } = req.body;

        const stateProductBrand = await StateModel.findOne({
            where: {
                nombre_estado: 'Activo'
            }
        });

        if (!stateProductBrand) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const newProductBrand = await ProductBrandModel.create({
            nombre_marca,
            ID_Estado_FK: stateProductBrand.id
        });

        res.status(201).send({ msg: "Se ha registrado una nueva marca de producto.", newProductBrand })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡La marca de producto ya existe!" });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
};

/**
 * Función para ver todas las marcas de productos
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Marca de Producto (brand_product.js), 
 */

const readProductBrands = async (req, res) => {
    try {
        const productBrands = await ProductBrandModel.findAll({});

        if (productBrands.length === 0) {
            return res.status(404).send({ error: "No hay marcas de productos registradas." });
        }

        res.status(200).send({ productBrands });
    } catch (error) {
        res.status(500).send({ errr: "Error interno del servidor.", error });
    }
};

/**
 * Función para ver la marca de producto por id
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Marca de Producto (brand_product.js)
 */

const readProductBrandId = async (req, res) => {
    try {
        const { id } = req.params;
        const productBrand = await ProductBrandModel.findByPk(id);

        if (!productBrand) {
            return res.status(404).send({ error: "Marca de producto no encontrada." });
        }

        res.status(200).send({ productBrand });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar marca de producto por id
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Marca de Producto (brand_product.js)
 */

const updateProductBrandId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['nombre_marca'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const productBrand = await ProductBrandModel.findByPk(id);

        if (!productBrand) {
            return res.status(404).send({ error: "Marca de producto no encontrada." });
        }

        updates.forEach((update) => productBrand[update] = req.body[update]);

        await productBrand.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar lógicamente a una marca de producto por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Marca de Producto (brand_product.js),
 *              Modelo Estado (state.js)
 */

const deleteProductBrandId = async (req, res) => {
    try {
        const { id } = req.params;
        const productBrand = await ProductBrandModel.findByPk(id);

        if (!productBrand) {
            return res.status(404).send({ error: "Marca de producto no encontrada." });
        }

        const stateProductBrand = await StateModel.findOne({
            where: {
                nombre_estado: "Inactivo"
            }
        });

        productBrand.ID_Estado_FK = stateProductBrand.id;
        await productBrand.save();
        res.status(200).send({ msg: "Marca de producto eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createProductBrand,
    readProductBrands,
    readProductBrandId,
    updateProductBrandId,
    deleteProductBrandId
};