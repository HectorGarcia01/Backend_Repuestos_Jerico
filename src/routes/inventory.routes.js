const express = require('express');
const router =  new express.Router();
const {
    addCategory
} = require('../controllers/category.controller');
const {
    categorySchema
} = require('../schemas/inventory.schema');
const validate = require('../middlewares/validate');
// const auth = require('');

//Rutas (endpoints para categoría)
router.post('/admin/crear/categoria', validate(categorySchema), addCategory);

//Rutas (endpoints para productos)

//Rutas (endpoints para inventario)

module.exports = router;