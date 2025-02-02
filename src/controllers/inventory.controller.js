const Sequelize = require('sequelize');
const InventoryModel = require('../models/inventory');
const EmployeeModel = require('../models/employee');
const ProductModel = require('../models/product');

/**
 * Función para ver todo el inventario
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Inventario (inventory.js)
 */

const readInventories = async (req, res) => {
    try {
        const { query } = req;
        const where = {};

        if (query.tipo_movimiento) {
            where.tipo_movimiento = {
                [Sequelize.Op.like]: `%${query.tipo_movimiento}%`
            };
        }

        if (query.cantidad_movimiento) {
            where.cantidad_movimiento = query.cantidad_movimiento;
        }

        if (query.monto_movimiento) {
            where.monto_movimiento = query.monto_movimiento;
        }

        const inventories = await InventoryModel.findAll({ where });

        if (inventories.length === 0) {
            return res.status(404).send({ error: "No se encontraron inventarios que coincidan con los criterios de búsqueda." });
        }

        res.status(200).send({ inventories });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver el detalle de un inventario por id
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Inventario (inventory.js), 
 *              Modelo Empleado (employee.js),
 *              Modelo Producto (product.js)
 */

const readInventoryId = async (req, res) => {
    try {
        const { id } = req.params;

        const inventory = await InventoryModel.findByPk(id, {
            include: [{
                model: EmployeeModel,
                as: 'empleado',
                attributes: ['id', 'nombre', 'apellido']
            }, {
                model: ProductModel,
                as: 'producto',
                attributes: ['id', 'nombre_producto', 'descripcion_producto', 'precio_venta', 'precio_compra', 'ganancia_venta']
            }]
        });

        if (inventory.length === 0) {
            return res.status(404).send({ error: "Inventario no encontrado." });
        }

        res.status(200).send({ inventory });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    readInventories,
    readInventoryId
}