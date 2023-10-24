const express = require('express');
const router =  new express.Router();
const {
    readInventories
} = require('../controllers/inventory.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Configuración de rutas (endpoints) para el SuperAdmin
router.get('/superAdmin/ver/inventarios', authMiddleware, roleMiddleware('SuperAdmin'), readInventories);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/inventarios', authMiddleware, roleMiddleware('Admin'), readInventories);

module.exports = router;