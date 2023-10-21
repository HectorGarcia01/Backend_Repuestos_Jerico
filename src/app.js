const { PORT } = require('./config/config');
const express = require('express');
const db = require('./database/db_connection');
const seedData = require('./controllers/seed_data.controller');
const customerRoutes = require('./routes/customer.routes');
const employeeRoutes = require('./routes/employee.routes');
const addressRoutes = require('./routes/address.routes');
const authRoutes = require('./routes/auth.routes');
const imagesRoutes = require('./routes/upload_images.routes');
const shoppingRoutes = require('./routes/shopping.routes');
const supplierRoutes = require('./routes/supplier.routes');
const categoryRoutes = require('./routes/category.routes');
const brandProductRoutes = require('./routes/brand_product.routes');
const productLocation = require('./routes/product_location.routes');
const productRoutes = require('./routes/product.routes');
const inventroryRoutes = require('./routes/inventory.routes');

const app = express();

//Conexión a la base de datos
(async () => {
    try {
        await db.authenticate();
        await db.sync();
        await seedData();
    } catch (error) {
        throw new Error(error);
    }
})();

//Configuración de cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
    next();
});

app.use(express.json());

//Configuración de rutas (endpoints)
app.use(customerRoutes);
app.use(employeeRoutes);
app.use(addressRoutes);
app.use(authRoutes);
app.use(imagesRoutes);
app.use(shoppingRoutes);
app.use(supplierRoutes);
app.use(categoryRoutes);
app.use(brandProductRoutes);
app.use(productLocation);
app.use(productRoutes);
app.use(inventroryRoutes);

//Configuración del manejo de rutas inexistentes
app.get('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

//Inicializando el servidor 
app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto: ${PORT}`);
});
