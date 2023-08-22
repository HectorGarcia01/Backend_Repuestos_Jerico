/**
 * Middleware de validación de datos de entrada
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Cada esquema de validación de la carpeta "schemas".
 */

module.exports = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
};