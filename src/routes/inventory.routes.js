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
// const auth = require('');

//Rutas (endpoints para categoría)
router.post('/superAdmin/crear/categoria', validate(categorySchema), addCategory);
router.post('/admin/crear/categoria', validate(categorySchema), addCategory);
router.get('/superAdmin/ver/categorias', readCategories);
router.get('/admin/ver/categorias', readCategories);
router.get('/usuario/ver/categorias', readCategories);

//Rutas (endpoints para productos)

//Rutas (endpoints para inventario)

module.exports = router;