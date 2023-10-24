const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Productos
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const productSchema = Joi.object({
    nombre_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre del producto es obligatorio, debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    codigo_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("El código del producto debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    precio_compra: Joi.number()
        .required()
        .error((error) => {
            return customError("El precio de compra es obligatorio y debe de ser númerico.", error);
        }),
    precio_venta: Joi.number()
        .required()
        .error((error) => {
            return customError("El precio de venta es obligatorio y debe de ser númerico.", error);
        }),
    ganancia_venta: Joi.number()
        .required()
        .error((error) => {
            return customError("La ganancia es obligatorio y debe de ser númerico.", error);
        }),
    descripcion_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("La descripción debe de tener un mínimo de 3 y un máximo de 200 carácteres.", error);
        }),
    medida_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("La medida del producto debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    color_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("El color del producto debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    cantidad_stock: Joi.number()
        .integer()
        .required()
        .error((error) => {
            return customError("La cantidad del producto es obligatoria y debe de ser numérica.", error);
        }),
    ID_Categoria_FK: Joi.number()
        .integer()
        .required()
        .min(1)
        .error((error) => {
            return customError("La categoría es obligatoria, debe de ser numérico y no debe de ser negativo.", error);
        }),
    ID_Marca_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("La marca debe de ser numérica y no debe de ser negativo.", error);
        }),
    ID_Ubicacion_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("La marca debe de ser numérica y no debe de ser negativo.", error);
        })
});

/**
 * Esquema de validación de actualización de datos de producto
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateProductSchema = Joi.object({
    nombre_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("El nombre del producto debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    codigo_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("El código del producto debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    precio_compra: Joi.number()
        .error((error) => {
            return customError("El precio de compra debe de ser númerico.", error);
        }),
    precio_venta: Joi.number()
        .error((error) => {
            return customError("El precio de venta debe de ser númerico.", error);
        }),
    ganancia_venta: Joi.number()
        .error((error) => {
            return customError("La ganancia debe de ser númerica.", error);
        }),
    descripcion_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("La descripción debe de tener un mínimo de 3 y un máximo de 200 carácteres.", error);
        }),
    medida_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("La medida del producto debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    color_producto: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("El color del producto debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    cantidad_stock: Joi.number()
        .integer()
        .error((error) => {
            return customError("La cantidad del producto debe de ser numérica.", error);
        }),
    ID_Categoria_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("La categoría debe de ser numérica y no debe de ser negativa.", error);
        }),
    ID_Marca_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("La marca debe de ser numérica y no debe de ser negativo.", error);
        }),
    ID_Ubicacion_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("La marca debe de ser numérica y no debe de ser negativo.", error);
        })
});

//Exportación del esquema de validación
module.exports = {
    productSchema,
    updateProductSchema
};