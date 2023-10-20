const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Factura_Venta = require('../models/sales_invoice');
const Producto = require('../models/product');

/**
 * Creación del modelo Detalle_Venta
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Factura_Venta (sales_invoice.js),
 *              Modelo Producto (product.js) 
 */

const Detalle_Venta = db.define(`JHSGR_Detalle_Venta`, {
    cantidad_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    subtotal_venta: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Factura_Venta_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `JHSGR_Factura_Venta`,
            key: 'id'
        }
    },
    ID_Producto_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `JHSGR_Productos`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Factura_Venta (sales_invoice.js) -> uno
 *              Modelo Detalle_Venta (sales_detail.js)  -> muchos
 */

Factura_Venta.hasMany(Detalle_Venta, {
    foreignKey: 'ID_Factura_Venta_FK',
    as: 'detalles_venta'
});

Detalle_Venta.belongsTo(Factura_Venta, {
    foreignKey: 'ID_Factura_Venta_FK',
    as: 'factura_venta'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (product.js) -> uno
 *              Modelo Detalle_Venta (sales_detail.js)  -> muchos
 */

Producto.hasMany(Detalle_Venta, {
    foreignKey: 'ID_Producto_FK',
    as: 'detalles_venta'
});

Detalle_Venta.belongsTo(Producto, {
    foreignKey: 'ID_Producto_FK',
    as: 'producto'
});

module.exports = Detalle_Venta;