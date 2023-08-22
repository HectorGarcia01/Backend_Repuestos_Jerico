const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Inventario (Categoría y Producto)
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const inventorySchema = Joi.object({
    //Para categoría
    nombre_categoria: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre de categoría es obligatorio.", error);
        }),
    //Para producto
    nombre_producto: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre del producto es obligatorio.", error);
        }),
    marca_producto: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("La marca del producto es obligatoria.", error);
        }),
    precio_promedio: Joi.number()
        .required()
        .error((error) => {
            return customError("El precio es obligatorio y debe de ser númerico.", error);
        }),
    descripcion_producto: Joi.string()
        .trim(),
    //Para inventario
    cantidad_stock: Joi.number()
        .integer()
        .required()
        .error((error) => {
            return customError("La cantidad del producto es obligatoria y debe de ser numérico.", error);
        })
});

//Exportación del esquema de validación
module.exports = inventorySchema;