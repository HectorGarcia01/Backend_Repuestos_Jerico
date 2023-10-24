const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos ubicación del producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const productLocationSchema = Joi.object({
    nombre_estanteria: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(200)
        .required()
        .trim()
        .error((error) => {
            return customError("La ubicación del producto es obligatoria, debe de tener un mínimo de 3 y un máximo de 200 carácteres.", error);
        })
});

/**
 * Esquema de validación de actualización de datos de ubicación de producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateProductLocationSchema = Joi.object({
    nombre_estanteria: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(200)
        .trim()
        .error((error) => {
            return customError("La ubicación de producto debe de tener un mínimo de 3 y un máximo de 200 carácteres.", error);
        })
});

//Exportación del esquema de validación
module.exports = {
    productLocationSchema,
    updateProductLocationSchema
};