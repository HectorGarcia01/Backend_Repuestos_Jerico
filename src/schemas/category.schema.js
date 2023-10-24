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
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre de categoría es obligatorio, debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    descripcion_categoria: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("La descripción debe de tener un mínimo de 10 y un máximo de 200 carácteres.", error);
        })
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
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("Nombre de categoría debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
        }),
    descripcion_categoria: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(10)
        .max(200)
        .trim()
        .error((error) => {
            return customError("La descripción debe de tener un mínimo de 10 y un máximo de 200 carácteres.", error);
        }),
});

//Exportación del esquema de validación
module.exports = {
    categorySchema,
    updateCategorySchema
};