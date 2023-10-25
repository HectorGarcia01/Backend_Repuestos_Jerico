const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Empleado = require('../models/employee');
const Producto = require('../models/product');

/**
 * Creación del modelo Inventario
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Producto (product.js)
 */

const Inventario = db.define('JHSGR_Inventario', {
    tipo_movimiento: {
        type: DataTypes.STRING(6),
        allowNull: false,
        values: ['Compra', 'Venta', 'Ajuste']
    },
    cantidad_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto_movimiento: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JHSGR_Empleados',
            key: 'id'
        }
    },
    ID_Producto_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JHSGR_Productos',
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Empleado (employee.js) -> uno
 *              Modelo Inventario (inventory.js)  -> muchos
 */

Empleado.hasMany(Inventario, {
    foreignKey: 'ID_Empleado_FK',
    as: 'inventarios'
});

Inventario.belongsTo(Empleado, {
    foreignKey: 'ID_Empleado_FK',
    as: 'empleado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (product.js) -> uno
 *              Modelo Inventario (inventory.js)  -> muchos
 */

Producto.hasMany(Inventario, {
    foreignKey: 'ID_Producto_FK',
    as: 'inventarios'
});

Inventario.belongsTo(Producto, {
    foreignKey: 'ID_Producto_FK',
    as: 'producto'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

Inventario.prototype.toJSON = function () {
    const inventory = { ...this.get() };

    delete inventory.ID_Empleado_FK;
    delete inventory.ID_Producto_FK;
    delete inventory.updatedAt;

    return inventory;
};

module.exports = Inventario;