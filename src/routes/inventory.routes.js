const express = require('express');
const router =  new express.Router();
// const {
    
// } = require('../controllers/ALGOALGOALGOALGOALGOALGO.controller');
// const {
    
// } = require('../schemas/ALGOALGOALGOALGO.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Rutas (endpoints para inventario)

module.exports = router;