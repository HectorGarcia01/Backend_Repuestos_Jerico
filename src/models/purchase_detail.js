const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Factura_Compra = require('../models/purchase_invoice');
const Producto = require('../models/product');

/**
 * Creación del modelo Detalle_Compra
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Factura_Compra (purchase_invoice.js),
 *              Modelo Producto (product.js)
 */

const Detalle_Compra = db.define(`JHSGR_Detalle_Compra`, {
    cantidad_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    subtotal_compra: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Factura_Compra_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `JHSGR_Factura_Compras`,
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
 *              Modelo Factura_Compra (purchase_invoice.js) -> uno
 *              Modelo Detalle_Compra (purchase_detail.js)  -> muchos
 */

Factura_Compra.hasMany(Detalle_Compra, {
    foreignKey: 'ID_Factura_Compra_FK',
    as: 'detalles_compra'
});

Detalle_Compra.belongsTo(Factura_Compra, {
    foreignKey: 'ID_Factura_Compra_FK',
    as: 'factura_compra'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (product.js) -> uno
 *              Modelo Detalle_Compra (purchase_detail.js)  -> muchos
 */

Producto.hasMany(Detalle_Compra, {
    foreignKey: 'ID_Producto_FK',
    as: 'detalles_compra'
});

Detalle_Compra.belongsTo(Producto, {
    foreignKey: 'ID_Producto_FK',
    as: 'producto'
});

module.exports = Detalle_Compra;