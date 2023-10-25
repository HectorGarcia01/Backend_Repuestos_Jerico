const express = require('express');
const router =  new express.Router();
const {
    readInventories,
    readInventoryId
} = require('../controllers/inventory.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Configuración de rutas (endpoints) para el SuperAdmin
router.get('/superAdmin/ver/inventarios', authMiddleware, roleMiddleware('SuperAdmin'), readInventories);
router.get('/superAdmin/ver/inventario/:id', authMiddleware, roleMiddleware('SuperAdmin'), readInventoryId);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/inventarios', authMiddleware, roleMiddleware('Admin'), readInventories);
router.get('/admin/ver/inventario/:id', authMiddleware, roleMiddleware('Admin'), readInventoryId);

module.exports = router;