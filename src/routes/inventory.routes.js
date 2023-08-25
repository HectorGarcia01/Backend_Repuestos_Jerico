const express = require('express');
const router =  new express.Router();
const {
    addCategory,
    readCategories
} = require('../controllers/category.controller');
const {
    categorySchema
} = require('../schemas/inventory.schema');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Rutas (endpoints para categoría)
router.post('/superAdmin/crear/categoria', authMiddleware, roleMiddleware('SuperAdmin'), validate(categorySchema), addCategory);
router.post('/admin/crear/categoria', authMiddleware, roleMiddleware('Admin'), validate(categorySchema), addCategory);
router.get('/superAdmin/ver/categorias', authMiddleware, roleMiddleware('SuperAdmin'), readCategories);
router.get('/admin/ver/categorias', authMiddleware, roleMiddleware('Admin'), readCategories);
router.get('/usuario/ver/categorias', readCategories);

//Rutas (endpoints para productos)

//Rutas (endpoints para inventario)

module.exports = router;