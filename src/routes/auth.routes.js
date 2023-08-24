const express = require('express');
const router = new express.Router();
const {
    login
} = require('../controllers/auth.controller');
const authSchema = require('../schemas/auth.schema');
const validateMiddleware = require('../middlewares/validate');

router.post('/usuario/login', validateMiddleware(authSchema), login);

//Exportación de todas las rutas de autenticación
module.exports = router;