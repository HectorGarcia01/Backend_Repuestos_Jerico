const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Estado = require('../models/state');
const Categoria = require('../models/category');
const Marca = require('../models/brand_product');
const Ubicacion_Producto = require('../models/product_location');

/**
 * Creación del modelo Producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js),
 *              Modelo Categoria (category.js)
 */

const Producto = db.define('JHSGR_Producto', {
    nombre_producto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    codigo_producto: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    precio_compra: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    precio_venta: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ganancia_venta: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    descripcion_producto: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    medida_producto: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    color_producto: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    cantidad_stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagen_producto: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    QR_producto: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JHSGR_Estados',
            key: 'id'
        }
    },
    ID_Categoria_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JHSGR_Categoria',
            key: 'id'
        }
    },
    ID_Marca_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'JHSGR_Marca_Productos',
            key: 'id'
        }
    },
    ID_Ubicacion_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'JHSGR_Ubicacion_Productos',
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (employee.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Producto, {
    foreignKey: 'ID_Estado_FK'
});

Producto.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Categoría (category.js) -> uno
 *              Modelo Producto (product.js)  -> muchos
 */

Categoria.hasMany(Producto, {
    foreignKey: 'ID_Categoria_FK',
    as: 'productos'
});

Producto.belongsTo(Categoria, {
    foreignKey: 'ID_Categoria_FK',
    as: 'categoria'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Marca_Producto (brand_product.js) -> uno
 *              Modelo Producto (product.js)  -> muchos
 */

Marca.hasMany(Producto, {
    foreignKey: 'ID_Marca_FK',
    as: 'productos'
});

Producto.belongsTo(Marca, {
    foreignKey: 'ID_Marca_FK',
    as: 'marca'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Ubicacion_Producto (product_location.js) -> uno
 *              Modelo Producto (product.js)  -> muchos
 */

Ubicacion_Producto.hasMany(Producto, {
    foreignKey: 'ID_Ubicacion_FK',
    as: 'productos'
});

Producto.belongsTo(Ubicacion_Producto, {
    foreignKey: 'ID_Ubicacion_FK',
    as: 'ubicacion_categoria'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

Producto.prototype.toJSON = function () {
    const product = { ...this.get() };

    delete product.createdAt;
    delete product.updatedAt;

    return product;
};

module.exports = Producto;