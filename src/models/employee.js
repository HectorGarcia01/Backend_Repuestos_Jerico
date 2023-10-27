const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN } = require('../config/config');
const Estado = require('../models/state');

/**
 * Creación del modelo Empleado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Empleado = db.define('JHSGR_Empleado', {
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
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Empleado (employee.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Empleado, {
    foreignKey: 'ID_Estado_FK'
});

Empleado.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Hook para el cifrado de contraseña
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: Datos del empleado actual
 */

Empleado.beforeCreate(async (employee) => {
    employee.password = await bcrypt.hash(employee.password, 8);
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Empleado.prototype.generateAuthToken = (id, role) => {
    const token = jwt.sign({ id: id.toString(), role }, KEY_TOKEN);
    return token;
};

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

Empleado.prototype.findByCredentials = async (correo, password) => {
    const { id } = await Estado.findOne({
        where: {
            nombre_estado: 'Activo'
        }
    });

    const employee = await Empleado.findOne({
        where: {
            correo,
            ID_Estado_FK: id
        }
    });

    if (!employee) {
        return false;
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
        throw new Error("Credenciales inválidas.");
    }

    return employee;
};

/**
 * Método personalizado para filtrar información
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

Empleado.prototype.toJSON = function () {
    const employee = { ...this.get() };

    delete employee.foto_perfil;
    delete employee.password;
    delete employee.ID_Estado_FK;
    delete employee.ID_Rol_FK;
    delete employee.createdAt;
    delete employee.updatedAt;

    return employee;
};

module.exports = Empleado;