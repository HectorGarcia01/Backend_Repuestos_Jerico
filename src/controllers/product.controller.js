const Sequelize = require('sequelize');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');
const CategoryModel = require('../models/category');
const BrandProductModel = require('../models/brand_product');

/**
 * Función para registrar un nuevo producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Producto (product.js), 
 *              Modelo Estado (state.js),
 *              Modelo Categoria (category.js),
 *              Modelo Marca_Producto (brand_product.js)
 */

const createProduct = async (req, res) => {
    try {
        const { user } = req;
        const {
            nombre_producto,
            codigo_producto,
            precio_compra,
            precio_venta,
            ganancia_venta,
            descripcion_producto,
            medida_producto,
            color_producto,
            cantidad_stock,
            ID_Categoria_FK,
            ID_Marca_FK,
        } = req.body;

        const category = await CategoryModel.findByPk(ID_Categoria_FK);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        const brandProduct = await BrandProductModel.findByPk(ID_Marca_FK);

        if (!brandProduct) {
            return res.status(404).send({ error: "Marca del producto no encontrada." });
        }

        const stateProduct = await StateModel.findOne({
            where: {
                nombre_estado: 'Activo'
            }
        });

        if (!stateProduct) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const newProduct = await ProductModel.create({
            nombre_producto,
            codigo_producto,
            precio_compra,
            precio_venta,
            ganancia_venta,
            descripcion_producto,
            medida_producto,
            color_producto,
            cantidad_stock,
            ID_Estado_FK: stateProduct.id,
            ID_Categoria_FK,
            ID_Marca_FK
        });

        res.status(201).send({ msg: "Se ha registrado un nuevo producto.", newProduct })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El producto ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error });
        }
    }
};

/**
 * Función para ver todos los productos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js), 
 */

const readProducts = async (req, res) => {
    try {
        const products = await ProductModel.findAll({});

        if (products.length === 0) {
            return res.status(404).send({ error: "No hay productos registrados." });
        }

        res.status(200).send({ products });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver un producto por ID
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js),
 */

const readProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        res.status(200).send({ product });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar datos del producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js)
 */

const updateProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const { ID_Categoria_FK, ID_Marca_FK } = req.body;
        const updates = Object.keys(req.body);

        const allowedUpdates = [
            'nombre_producto',
            'codigo_producto',
            'precio_compra',
            'precio_venta',
            'ganancia_venta',
            'descripcion_producto',
            'medida_producto',
            'color_producto',
            'cantidad_stock',
            'ID_Categoria_FK',
            'ID_Marca_FK',
        ];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        if (ID_Categoria_FK) {
            const category = await CategoryModel.findByPk(ID_Categoria_FK);

            if (!category) {
                return res.status(404).send({ error: "Categoría no encontrada." });
            }
        }

        if (ID_Marca_FK) {
            const brandProduct = await BrandProductModel.findByPk(ID_Marca_FK);

            if (!brandProduct) {
                return res.status(404).send({ error: "Marca del producto no encontrada." });
            }
        }

        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        updates.forEach((update) => product[update] = req.body[update]);

        await product.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar de forma lógica un producto por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js)
 */

const deleteProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        const stateProduct = await StateModel.findOne({
            where: {
                nombre_estado: "Inactivo"
            }
        });

        product.ID_Estado_FK = stateProduct.id;
        await product.save();
        res.status(200).send({ msg: "Producto eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createProduct,
    readProducts,
    readProductId,
    updateProductId,
    deleteProductId
};