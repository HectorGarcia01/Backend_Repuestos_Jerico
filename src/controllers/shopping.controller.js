const SalesInvoiceModel = require('../models/sales_invoice');
const SalesDetailModel = require('../models/sales_detail');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');

/**
 * Función para registrar/actualizar productos en el carrito de compras
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
        const { ID_Producto_FK, cantidad_producto } = req.body;

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
            return res.status(404).send({ error: "Detalle del carrito de compras no encontrado." });
        }

        res.status(200).send({ shoppingDetailCart });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

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
            return res.status(404).send({ error: "Carrito de compras no encontrado." });
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
                ID_Estado_FK: stateSalesInvoice.id
            }
        });

        if (!salesInvoice) {
            return res.status(404).send({ error: "Carrito de compras no encontrado." });
        }

        const stateSalesInvoice = await StateModel.findOne({
            where: {
                nombre_estado: 'Pendiente'
            }
        });

        if (!stateSalesInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        salesInvoice.ID_Estado_FK = stateSalesInvoice.id;
        await salesInvoice.save();

        res.status(200).send({ msg: "Compra procesada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = { 
    createShoppingCart,
    readShoppingCart,
    deleteProductIdShoppingCart,
    deleteShoppingCart,
    processCustomerSale
}