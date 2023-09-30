const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de marca de producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const productBrandSchema = Joi.object({
    nombre_marca: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("La marca de producto es obligatoria.", error);
        })
});

/**
 * Esquema de validación de actualización de datos de marca de producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateProductBrandSchema = Joi.object({
    nombre_marca: Joi.string()
        .trim()
        .error((error) => {
            return customError("Marca de producto inválida.", error);
        })
});

//Exportación del esquema de validación
module.exports = {
    productBrandSchema,
    updateProductBrandSchema
};