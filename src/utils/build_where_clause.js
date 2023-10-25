const Sequelize = require('sequelize');
const StateModel = require('../models/state');
const CategoryModel = require('../models/category');
const BrandProductModel = require('../models/brand_product');
const ProductLocationModel = require('../models/product_location');

/**
 * Función para construir el objeto where de la consulta
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js), 
 *              Modelo Categoria (category.js),
 *              Modelo Marca_Producto (brand_product.js),
 *              Modelo Ubicacion_Producto (product_location.js)
 */

const buildWhereClause = async (query) => {
    const where = {};

    if (query.nombre) {
        where.nombre_producto = {
            [Sequelize.Op.like]: `%${query.nombre}%`
        };
    }

    if (query.codigo) {
        where.codigo_producto = {
            [Sequelize.Op.like]: `%${query.codigo}%`
        };
    }

    if (query.precio_compra) {
        where.precio_compra = query.precio_compra;
    }

    if (query.precio_venta) {
        where.precio_venta = query.precio_venta;
    }

    if (query.descripcion) {
        where.descripcion_producto = {
            [Sequelize.Op.like]: `%${query.descripcion}%`
        };
    }

    if (query.medida) {
        where.medida_producto = {
            [Sequelize.Op.like]: `%${query.medida}%`
        };
    }

    if (query.color) {
        where.color_producto = {
            [Sequelize.Op.like]: `%${query.color}%`
        };
    }

    if (query.QR_producto) {
        where.QR_producto = {
            [Sequelize.Op.like]: `%${query.QR_producto}%`
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

        where.ID_Estado_FK = stateCustomer.id
    }

    if (query.categoria) {
        const category = await CategoryModel.findOne({
            where: {
                nombre_categoria: query.categoria
            }
        });

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        where.ID_Categoria_FK = category.id;
    }

    if (query.marca) {
        const brandProduct = await BrandProductModel.findOne({
            where: {
                nombre_marca: query.marca
            }
        });

        if (!brandProduct) {
            return res.status(404).send({ error: "Marca no encontrada." });
        }

        where.ID_Marca_FK = brandProduct.id;
    }

    if (query.ubicacion) {
        const productLocation = await ProductLocationModel.findOne({
            where: {
                nombre_estanteria: query.ubicacion
            }
        });

        if (!productLocation) {
            return res.status(404).send({ error: "Ubicación no encontrada." });
        }

        where.ID_Ubicacion_FK = productLocation.id;
    }

    return where;
}

module.exports = buildWhereClause;