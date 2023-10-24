const express = require('express');
const router = new express.Router();
const {
    createCategory,
    readCategories,
    readCategoriesPagination,
    readCategoryId,
    updateCategoryId,
    deleteCategoryId
} = require('../controllers/category.controller');
const {
    categorySchema,
    updateCategorySchema
} = require('../schemas/category.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/crear/categoria',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(categorySchema),
    createCategory
);
router.get('/superAdmin/ver/categorias', authMiddleware, roleMiddleware('SuperAdmin'), readCategories);
router.get('/superAdmin/ver/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin'), readCategoryId);
router.patch(
    '/superAdmin/actualizar/categoria/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(updateCategorySchema),
    updateCategoryId
);
router.delete('/superAdmin/eliminar/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteCategoryId);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/crear/categoria',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(categorySchema),
    createCategory
);
router.get('/admin/ver/categorias', authMiddleware, roleMiddleware('Admin'), readCategories);
router.get('/admin/ver/categoria/:id', authMiddleware, roleMiddleware('Admin'), readCategoryId);
router.patch(
    '/admin/actualizar/categoria/:id',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(updateCategorySchema),
    updateCategoryId
);

//Configuración de rutas (endpoints) para el home
router.get('/usuario/ver/categorias', readCategories);
router.get('/usuario/ver/categorias/paginacion', readCategoriesPagination);
router.get('/usuario/ver/categoria/:id', readCategoryId);

module.exports = router;