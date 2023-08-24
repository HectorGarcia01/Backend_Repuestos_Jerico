/**
 * Middleware de validación de rol
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const checkRole = (role) => (req, res, next) => {
    try {
        if (req.role !== role) {
            throw new Error("No tienes los permisos necesarios para realizar esta acción.");
        }

        next();
    } catch (error) {
        res.status(403).send({ error: error.message });
    }
};

module.exports = checkRole;