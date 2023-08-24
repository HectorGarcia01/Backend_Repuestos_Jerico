const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN } = require('../config/config');

/**
 * Creación del modelo Cliente
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Cliente = db.define('Cliente', {
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
    correo: {
        type: DataTypes.STRING(30),
        allowNull: false,
        low: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING(25),
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
            model: 'Estados',
            key: 'id'
        }
    },
    ID_Rol_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rols',
            key: 'id'
        }
    }
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
}

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

Cliente.prototype.findByCredentials = async (correo, password) => {
    const customer = await Cliente.findOne({
        where: {
            correo
        }
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
    delete customer.createdAt;
    delete customer.updatedAt;
    delete customer.ID_Rol_FK;

    return customer;
};

module.exports = Cliente;