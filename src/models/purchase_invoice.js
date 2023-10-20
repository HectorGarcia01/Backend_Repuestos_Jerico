const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Empleado = require('../models/employee');
const Proveedor = require('../models/supplier');

/**
 * Creación del modelo Factura_Compra
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Proveedor (supplier.js)
 */

const Factura_Compra = db.define(`JHSGR_Factura_Compra`, {
    total_factura: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `JHSGR_Empleados`,
            key: 'id'
        }
    },
    ID_Proveedor_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `JHSGR_Proveedors`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Empleado (employee.js) -> uno
 *              Modelo Factura_Compra (purchase_invoice.js)  -> muchos
 */

Empleado.hasMany(Factura_Compra, {
    foreignKey: 'ID_Empleado_FK',
    as: 'facturas_compras'
});

Factura_Compra.belongsTo(Empleado, {
    foreignKey: 'ID_Empleado_FK',
    as: 'empleado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Proveedor (supplier.js) -> uno
 *              Modelo Factura_Compra (purchase_invoice.js)  -> muchos
 */

Proveedor.hasMany(Factura_Compra, {
    foreignKey: 'ID_Proveedor_FK',
    as: 'facturas_compras'
});

Factura_Compra.belongsTo(Proveedor, {
    foreignKey: 'ID_Proveedor_FK',
    as: 'proveedor'
});

module.exports = Factura_Compra;