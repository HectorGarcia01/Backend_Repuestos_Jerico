const Sequelize = require('sequelize');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');
const CategoryModel = require('../models/category');
const BrandProductModel = require('../models/brand_product');
const ProductLocationModel = require('../models/product_location');
const buildWhereClause = require('../utils/build_where_clause');

/**
 * Función para registrar un nuevo producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Producto (product.js), 
 *              Modelo Estado (state.js),
 *              Modelo Categoria (category.js),
 *              Modelo Marca_Producto (brand_product.js),
 *              Modelo Ubicacion_Producto (product_location.js)
 */

const createProduct = async (req, res) => {
    try {
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
            ID_Ubicacion_FK
        } = req.body;

        const category = await CategoryModel.findByPk(ID_Categoria_FK);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        const brandProduct = await BrandProductModel.findByPk(ID_Marca_FK);

        if (!brandProduct) {
            return res.status(404).send({ error: "Marca del producto no encontrada." });
        }

        const productLocation = await BrandProductModel.findByPk(ID_Ubicacion_FK);

        if (!productLocation) {
            return res.status(404).send({ error: "Ubicación del producto no encontrada." });
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
            ID_Marca_FK,
            ID_Ubicacion_FK
        });

        res.status(201).send({ msg: "Se ha registrado un nuevo producto.", newProduct });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El producto ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todos los productos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js), 
 *              Función buildWhereClause (build_where_clause.js)
 */

const readProducts = async (req, res) => {
    try {
        const where = await buildWhereClause(req.query);
        console.log(where);

        const products = await ProductModel.findAll({ 
            where,
            include: [{
                model: CategoryModel,
                as: 'categoria',
                attributes: ['id', 'nombre_categoria']
            }, {
                model: BrandProductModel,
                as: 'marca',
                attributes: ['id', 'nombre_marca']
            }, {
                model: ProductLocationModel,
                as: 'ubicacion_categoria',
                attributes: ['id', 'nombre_estanteria']
            },
            {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (products.length === 0) {
            return res.status(404).send({ error: "No se encontraron productos que coincidan con los criterios de búsqueda." });
        }

        res.status(200).send({ products });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver los productos por paginación
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js), 
 *              Función buildWhereClause (build_where_clause.js)
 */

const readProductsPagination = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 6;
        const where = await buildWhereClause(req.query);

        const count = await ProductModel.count();
        const products = await ProductModel.findAll({
            where,
            include: [{
                model: CategoryModel,
                as: 'categoria',
                attributes: ['id', 'nombre_categoria']
            }, {
                model: BrandProductModel,
                as: 'marca',
                attributes: ['id', 'nombre_marca']
            }, {
                model: ProductLocationModel,
                as: 'ubicacion_categoria',
                attributes: ['id', 'nombre_estanteria']
            },
            {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (products.length === 0) {
            return res.status(404).send({ error: "No se encontraron productos que coincidan con los criterios de búsqueda." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);
        res.status(200).send({ products, currentPage: pageValue, totalPages });
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
        const product = await ProductModel.findByPk(id, {
            include: [{
                model: CategoryModel,
                as: 'categoria',
                attributes: ['id', 'nombre_categoria']
            }, {
                model: BrandProductModel,
                as: 'marca',
                attributes: ['id', 'nombre_marca']
            }, {
                model: ProductLocationModel,
                as: 'ubicacion_categoria',
                attributes: ['id', 'nombre_estanteria']
            },
            {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

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
        const { ID_Categoria_FK, ID_Marca_FK, ID_Ubicacion_FK } = req.body;
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
            'ID_Ubicacion_FK'
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

        if (ID_Ubicacion_FK) {
            const productLocation = await ProductLocationModel.findByPk(ID_Ubicacion_FK);

            if (!productLocation) {
                return res.status(404).send({ error: "Ubicación del producto no encontrada." });
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
    readProductsPagination,
    readProductId,
    updateProductId,
    deleteProductId
};