const SalesInvoiceModel = require('../models/sales_invoice');
const SalesDetailModel = require('../models/sales_detail');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');

/**
 * Función para registrar productos al carrito
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              
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

const readShoppingCartId = async (req, res) => {
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

module.exports = { 
    createShoppingCart,
    readShoppingCartId
}