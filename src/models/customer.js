const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN } = require('../config/config');
const Municipio = require('../models/municipality');
const Departamento = require('../models/department');
const Estado = require('../models/state');

/**
 * Creación del modelo Cliente
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Municipio (municipality.js).
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Cliente = db.define('JHSGR_Cliente', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    nit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    direccion_referencia: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING(30),
        allowNull: false,
        low: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foto_perfil: {
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
    ID_Rol_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JHSGR_Rols',
            key: 'id'
        }
    },
    ID_Municipio_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'JHSGR_Municipios',
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Cliente (customer.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Cliente, {
    foreignKey: 'ID_Estado_FK'
});

Cliente.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Configurando la relación de muchos a uno
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Cliente (department.js) -> muchos
 *              Modelo Municipio (municipality.js)  -> uno
 */

Cliente.belongsTo(Municipio, {
    foreignKey: 'ID_Municipio_FK',
    as: 'municipio'
});

Municipio.hasMany(Cliente, {
    foreignKey: 'ID_Municipio_FK',
    as: 'clientes'
});

/**
 * Hook para el cifrado de contraseña
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: Datos del cliente actual
 */

Cliente.beforeCreate(async (customer) => {
    customer.password = await bcrypt.hash(customer.password, 8);
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Cliente.prototype.generateAuthToken = (id, role) => {
    const token = jwt.sign({ id: id.toString(), role }, KEY_TOKEN);
    return token;
};

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Municipio (municipality.js),
 *              Modelo Departamento (department.js),
 *              Modelo Estado (state.js)
 */

Cliente.prototype.findByCredentials = async (correo, password) => {
    const { id } = await Estado.findOne({
        where: {
            nombre_estado: 'Activo'
        }
    });

    const customer = await Cliente.findOne({
        where: {
            correo,
            ID_Estado_FK: id
        },
        include: [{
            model: Municipio,
            as: 'municipio',
            include: [{
                model: Departamento,
                as: 'departamento'
            }]
        }, {
            model: Estado,
            as: 'estado',
            attributes: ['nombre_estado']
        }]
    });

    if (!customer) {
        return false;
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
        throw new Error("Credenciales inválidas.");
    }

    return customer;
};

/**
 * Método personalizado para filtrar información
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

Cliente.prototype.toJSON = function () {
    const customer = { ...this.get() };

    delete customer.foto_perfil;
    delete customer.password;
    delete customer.ID_Estado_FK;
    delete customer.ID_Rol_FK;
    delete customer.ID_Municipio_FK;
    delete customer.createdAt;
    delete customer.updatedAt;

    return customer;
};

module.exports = Cliente;