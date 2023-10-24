const InventoryModel = require('../models/inventory');
const EmployeeModel = require('../models/employee');
const ProductModel = require('../models/product');

/**
 * Función para ver todo el inventario
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Inventario (inventory.js), 
 *              Modelo Empleado (employee.js),
 *              Modelo Producto (product.js)
 */

const readInventories = async (req, res) => {
    try {
        const { query } = req;
        const where = {};

        const inventory = await InventoryModel.findAll({
            where,
            include: [{
                model: EmployeeModel,
                as: 'empleado',
                attributes: ['id', 'nombre', 'apellido']
            }, {
                model: ProductModel,
                as: 'producto',
                attributes: ['id', 'nombre_producto']
            }]
        });

        if (inventory.length === 0) {
            return res.status(404).send({ error: "No hay ninguna venta registrada." });
        }

        res.status(200).send({ inventory });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    readInventories
}