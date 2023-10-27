const SalesInvoiceModel = require('../models/sales_invoice');
const SalesDetailModel = require('../models/sales_detail');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');
const { Sequelize } = require('sequelize');

/**
 * Función para agregar productos en el carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Estado (state.js)
 */

const createShoppingCart = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Producto_FK } = req.body;
        let { cantidad_producto } = req.body;

        if (typeof cantidad_producto === 'string') {
            cantidad_producto = parseFloat(cantidad_producto);
        }

        const product = await ProductModel.findByPk(ID_Producto_FK);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        if (product.cantidad_stock < cantidad_producto) {
            return res.status(400).send({ error: "No hay suficiente stock disponible." });
        }

        const subtotal_venta = cantidad_producto * product.precio_venta;

        const stateShoppingCart = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!stateShoppingCart) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        let shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            }
        });
        
        if (!shoppingCart) {
            shoppingCart = await SalesInvoiceModel.create({
                nit_cliente: user.nit,
                total_factura: 0,
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            });
        }

        let shoppingCartDetail = await SalesDetailModel.findOne({
            where: {
                ID_Factura_Venta_FK: shoppingCart.id,
                ID_Producto_FK
            }
        });

        if (shoppingCartDetail) {
            shoppingCartDetail.cantidad_producto += cantidad_producto;
            shoppingCartDetail.subtotal_venta += subtotal_venta;
            await shoppingCartDetail.save();
        } else{
            shoppingCartDetail = await SalesDetailModel.create({
                cantidad_producto,
                precio_unitario: product.precio_venta,
                subtotal_venta,
                ID_Producto_FK,
                ID_Factura_Venta_FK: shoppingCart.id
            });
        }

        shoppingCart.total_factura +=  subtotal_venta;
        await shoppingCart.save();

        product.cantidad_stock -= cantidad_producto;
        await product.save();

        res.status(201).send({ msg: "Producto agregado al carrito con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver todo el detalle del carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js)
 */

const readShoppingCart = async (req, res) => {
    try {
        const { user } = req;
        const stateShoppingCart = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!stateShoppingCart) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const shoppingDetailCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            },
            attributes: ['id', 'total_factura'],
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                attributes: ['id', 'cantidad_producto', 'precio_unitario', 'subtotal_venta'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'nombre_producto', 'descripcion_producto']
                }
            }]
        });
        
        if (!shoppingDetailCart) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        res.status(200).send({ shoppingDetailCart });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para actualizar la cantidad de productos en el carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Estado (state.js)
 */

const updateShoppingCart = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Producto_FK } = req.body;
        let { cantidad_producto } = req.body;

        if (typeof cantidad_producto === 'string') {
            cantidad_producto = parseFloat(cantidad_producto);
        }

        const product = await ProductModel.findByPk(ID_Producto_FK);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        if (product.cantidad_stock < cantidad_producto) {
            return res.status(400).send({ error: "No hay suficiente stock disponible." });
        }

        const subtotal_venta = cantidad_producto * product.precio_venta;

        const stateShoppingCart = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!stateShoppingCart) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        let shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            }
        });

        if (!shoppingCart) {
            shoppingCart = await SalesInvoiceModel.create({
                nit_cliente: user.nit,
                total_factura: 0,
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            });
        }

        let shoppingCartDetail = await SalesDetailModel.findOne({
            where: {
                ID_Factura_Venta_FK: shoppingCart.id,
                ID_Producto_FK
            }
        });

        if (shoppingCartDetail) {
            shoppingCartDetail.cantidad_producto = cantidad_producto;
            shoppingCartDetail.subtotal_venta = subtotal_venta;
            await shoppingCartDetail.save();
        } else {
            shoppingCartDetail = await SalesDetailModel.create({
                cantidad_producto,
                precio_unitario: product.precio_venta,
                subtotal_venta,
                ID_Producto_FK,
                ID_Factura_Venta_FK: shoppingCart.id
            });
        }

        shoppingCart.total_factura += subtotal_venta;
        await shoppingCart.save();

        product.cantidad_stock -= cantidad_producto;
        await product.save();

        res.status(201).send({ msg: "Producto agregado al carrito con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar un producto del detalle del carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Estado (state.js)
 */

const deleteProductIdShoppingCart = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        const stateShoppingCart = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!stateShoppingCart) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            }
        });

        if (!shoppingCart) {
            return res.status(404).send({ error: "Carrito de compras no encontrado." });
        }

        const shoppingDetailCart = await SalesDetailModel.findOne({
            where: {
                ID_Factura_Venta_FK: shoppingCart.id,
                ID_Producto_FK: product.id
            }
        });

        if (!shoppingDetailCart) {
            return res.status(404).send({ error: "El producto no existe en el carrito." });
        }

        shoppingCart.total_factura -= shoppingDetailCart.subtotal_venta;
        product.cantidad_stock += shoppingDetailCart.cantidad_producto;
        await shoppingCart.save();
        await product.save();
        await shoppingDetailCart.destroy();

        res.status(200).send({ msg: "El producto ha sido eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar el carrito de compras
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js)
 */

const deleteShoppingCart = async (req, res) => {
    try {
        const { user } = req;

        const stateShoppingCart = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!stateShoppingCart) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const shoppingCart = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            },
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                include: {
                    model: ProductModel,
                    as: 'producto',
                }
            }]
        });

        if (!shoppingCart) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        const inactiveShoppingCart = await StateModel.findOne({
            where: {
                nombre_estado: "Inactivo"
            }
        });

        if (!inactiveShoppingCart) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        for (const detail of shoppingCart.detalles_venta) {
            const product = await ProductModel.findByPk(detail.producto.id);

            if (product) {
                product.cantidad_stock += detail.cantidad_producto;
                await product.save();
            }
        }

        shoppingCart.ID_Estado_FK = inactiveShoppingCart.id;
        await shoppingCart.save();
        
        res.status(200).send({ msg: "El carrito ha sido eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para procesar compra del cliente
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Estado (state.js)
 */

const processCustomerSale = async (req, res) => {
    try {
        const { user } = req;

        const stateShoppingCart = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!stateShoppingCart) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const salesInvoice = await SalesInvoiceModel.findOne({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: stateShoppingCart.id
            }
        });

        if (!salesInvoice) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        const stateSalesInvoice = await StateModel.findOne({
            where: {
                nombre_estado: 'Pendiente'
            }
        });

        if (!stateSalesInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const orden = `JRC-${user.id}-${salesInvoice.id}`;
        salesInvoice.numero_orden = orden;
        salesInvoice.ID_Estado_FK = stateSalesInvoice.id;
        await salesInvoice.save();

        res.status(200).send({ msg: `Compra procesada con éxito, tu número de orden es ${orden}.`, orden });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para cancelar la compra del cliente (solo con estado pendiente)
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js)
 */

const cancelCustomerSaleId = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const shopping = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Cliente_FK: user.id
            },
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                include: {
                    model: ProductModel,
                    as: 'producto',
                }
            }]
        });

        if (!shopping) {
            return res.status(404).send({ error: "Compra no encontrada." });
        }

        const stateShopping = await StateModel.findOne({
            where: {
                nombre_estado: 'Pendiente'
            }
        });

        if (!stateShopping) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        if (shopping.ID_Estado_FK !== stateShopping.id) {
            return res.status(404).send({ error: "Lo siento, no puedes cancelar esta compra." });
        }
        
        const cancelStateShopping = await StateModel.findOne({
            where: {
                nombre_estado: 'Cancelado'
            }
        });

        if (!cancelStateShopping) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        shopping.ID_Estado_FK = cancelStateShopping.id;
        await shopping.save();

        for (const detail of shopping.detalles_venta) {
            const product = await ProductModel.findByPk(detail.producto.id);

            if (product) {
                product.cantidad_stock += detail.cantidad_producto;
                await product.save();
            }
        }

        res.status(200).send({ msg: "Su compra ha sido cancelada." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver el historial de compra del cliente
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Estado (state.js)
 */

const shoppingHistory = async (req, res) => {
    try {
        const { user } = req;

        const inactiveStatusShopping = await StateModel.findOne({
            where: {
                nombre_estado: 'Inactivo'
            }
        });

        const carritoStatusShopping = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!inactiveStatusShopping || !carritoStatusShopping) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const customerPurchase = await SalesInvoiceModel.findAll({
            where: {
                ID_Cliente_FK: user.id,
                ID_Estado_FK: {
                    [Sequelize.Op.notIn]: [inactiveStatusShopping.id, carritoStatusShopping.id]
                }
            },
            attributes: ['id', 'numero_orden', 'total_factura'],
            include: {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }
        });

        if (customerPurchase.length === 0) {
            return res.status(404).send({ error: "No tienes ninguna compra procesada." });
        }

        res.status(200).send({ shoppingHistory: customerPurchase });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver el detalle de compra por id del cliente
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js)
 *              Modelo Estado (state.js)
 */

const shoppingHistoryId = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const inactiveStatusShopping = await StateModel.findOne({
            where: {
                nombre_estado: 'Inactivo'
            }
        });

        const carritoStatusShopping = await StateModel.findOne({
            where: {
                nombre_estado: 'Carrito'
            }
        });

        if (!inactiveStatusShopping || !carritoStatusShopping) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const shoppingDetail = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Cliente_FK: user.id,
                ID_Estado_FK: {
                    [Sequelize.Op.notIn]: [inactiveStatusShopping.id, carritoStatusShopping.id]
                }
            },
            attributes: ['id', 'total_factura'],
            include: [{
                model: SalesDetailModel,
                as: 'detalles_venta',
                attributes: ['id', 'cantidad_producto', 'precio_unitario', 'subtotal_venta'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'nombre_producto', 'descripcion_producto']
                }
            },
                {
                    model: StateModel,
                    as: 'estado',
                    attributes: ['id', 'nombre_estado']
                }]
        });

        if (!shoppingDetail) {
            return res.status(404).send({ error: "Detalle de compra no encontrado." });
        }

        res.status(200).send({ shoppingDetail });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = { 
    createShoppingCart,
    readShoppingCart,
    updateShoppingCart,
    deleteProductIdShoppingCart,
    deleteShoppingCart,
    processCustomerSale,
    cancelCustomerSaleId,
    shoppingHistory,
    shoppingHistoryId
}