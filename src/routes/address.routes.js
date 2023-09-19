const express = require('express');
const router = new express.Router();
const {
    readAddresses
} = require('../controllers/address.controller');
// const {
//     addressSchema
// } = require('../schemas/address.schema');
// const validateMiddleware = require('../middlewares/validate');
// const authMiddleware = require('../middlewares/auth');
// const roleMiddleware = require('../middlewares/check_role');

router.get('/usuario/ver/direcciones', readAddresses);

module.exports = router;