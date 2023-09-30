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
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre del producto es obligatorio.", error);
        }),
    codigo_producto: Joi.string()
        .trim(),
    precio_compra: Joi.number()
        .required()
        .error((error) => {
            return customError("El precio de compra es obligatorio y debe de ser númerico.", error);
        }),
    precio_venta: Joi.number()
        .required()
        .error((error) => {
            return customError("El precio de compra es obligatorio y debe de ser númerico.", error);
        }),
    ganancia_venta: Joi.number()
        .required()
        .error((error) => {
            return customError("La ganancia es obligatorio y debe de ser númerico.", error);
        }),
    descripcion_producto: Joi.string()
        .trim(),
    medida_producto: Joi.string()
        .trim(),
    color_producto: Joi.string()
        .trim(),
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
});

//Exportación del esquema de validación
module.exports = {
    productSchema
};