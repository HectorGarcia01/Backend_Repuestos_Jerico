const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Categoría
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const categorySchema = Joi.object({
    nombre_categoria: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre de categoría es obligatorio.", error);
        }),
    descripcion_categoria: Joi.string()
        .trim()
});

/**
 * Esquema de validación de actualización de datos de Categoría
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateCategorySchema = Joi.object({
    nombre_categoria: Joi.string()
        .trim()
        .error((error) => {
            return customError("Nombre de categoría inválido.", error);
        }),
    descripcion_categoria: Joi.string()
        .trim()
        .error((error) => {
            return customError("Descripción de categoría inválido.", error);
        }),
});

//Exportación del esquema de validación
module.exports = {
    categorySchema,
    updateCategorySchema
};