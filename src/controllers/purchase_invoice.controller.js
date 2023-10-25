const PurchaseInvoiceModel = require('../models/purchase_invoice');
const PurchaseDetailModel = require('../models/purchase_detail');
const SupplierModel = require('../models/supplier');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');

/**
 * Función para registrar/actualizar productos en la compra
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Modelo Proveedor (supplier.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js)
 */

const createPurchaseInvoice = async (req, res) => {
    try {
        const { user } = req;
        const { ID_Proveedor_FK, ID_Producto_FK, cantidad_producto } = req.body;
        let supplier;
        let product;

        if (ID_Proveedor_FK) {
            supplier = await SupplierModel.findByPk(ID_Proveedor_FK);

            if (!supplier) {
                return res.status(404).send({ error: "Proveedor no encontrado." });
            }
        }

        if (ID_Producto_FK) {
            product = await ProductModel.findByPk(ID_Producto_FK);

            if (!product) {
                return res.status(404).send({ error: "Producto no encontrado." });
            }
        }

        const subtotal_compra = cantidad_producto * product.precio_compra;

        const statePurchaseInvoice = await StateModel.findOne({
            where: {
                nombre_estado: "En proceso"
            }
        });

        if (!statePurchaseInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        let purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            }
        });

        if (!purchaseInvoice) {
            purchaseInvoice = await PurchaseInvoiceModel.create({
                total_factura: 0,
                ID_Empleado_FK: user.id,
                ID_Proveedor_FK,
                ID_Estado_FK: statePurchaseInvoice.id
            });
        }

        let purchaseDetail = await PurchaseDetailModel.findOne({
            where: {
                ID_Factura_Compra_FK: purchaseInvoice.id,
                ID_Producto_FK
            }
        });

        if (purchaseDetail) {
            purchaseDetail.cantidad_producto += cantidad_producto;
            purchaseDetail.subtotal_compra += subtotal_compra;
            await purchaseDetail.save();
        } else {
            purchaseDetail = await PurchaseDetailModel.create({
                cantidad_producto,
                precio_unitario: product.precio_compra,
                subtotal_compra,
                ID_Producto_FK,
                ID_Factura_Compra_FK: purchaseInvoice.id
            });
        }

        purchaseInvoice.total_factura += subtotal_compra;
        await purchaseInvoice.save();

        product.cantidad_stock += cantidad_producto;
        await product.save();

        res.status(201).send({ msg: "Producto agregado a la compra con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver la compra en proceso
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js)
 */

const readPurchaseInvoiceProcess = async (req, res) => {
    try {
        const { user } = req;
        const statePurchaseInvoice = await StateModel.findOne({
            where: {
                nombre_estado: "En proceso"
            }
        });

        if (!statePurchaseInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            },
            attributes: ['id', 'total_factura'],
            include: [{
                model: PurchaseDetailModel,
                as: 'detalles_compra',
                attributes: ['id', 'cantidad_producto', 'precio_unitario', 'subtotal_compra'],
                include: {
                    model: ProductModel,
                    as: 'producto',
                    attributes: ['id', 'nombre_producto', 'descripcion_producto']
                }
            }]
        });

        if (!purchaseInvoice) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        res.status(200).send({ purchaseInvoice });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar un producto de la compra en proceso
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Modelo Estado (state.js)
 */

const deleteProductIdPurchaseInvoice = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        const statePurchaseInvoice = await StateModel.findOne({
            where: {
                nombre_estado: "En proceso"
            }
        });

        if (!statePurchaseInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            }
        });

        if (!purchaseInvoice) {
            return res.status(404).send({ error: "Compra no encontrada." });
        }

        const purchaseDetail = await PurchaseDetailModel.findOne({
            where: {
                ID_Factura_Compra_FK: purchaseInvoice.id,
                ID_Producto_FK: product.id
            }
        });

        if (!purchaseDetail) {
            return res.status(404).send({ error: "El producto no existe en la compra." });
        }

        purchaseInvoice.total_factura -= purchaseDetail.subtotal_compra;
        product.cantidad_stock -= purchaseDetail.cantidad_producto;
        await purchaseInvoice.save();
        await product.save();
        await purchaseDetail.destroy();

        res.status(200).send({ msg: "El producto ha sido eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar la compra en proceso
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Compra (purchase_invoice.js), 
 *              Modelo Detalle_Compra (purchase_detail.js),
 *              Modelo Estado (state.js)
 */

const deletePurchaseInvoiceProcess = async (req, res) => {
    try {
        const { user } = req;

        const statePurchaseInvoice = await StateModel.findOne({
            where: {
                nombre_estado: "En proceso"
            }
        });

        if (!statePurchaseInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const purchaseInvoice = await PurchaseInvoiceModel.findOne({
            where: {
                ID_Empleado_FK: user.id,
                ID_Estado_FK: statePurchaseInvoice.id
            },
            include: [{
                model: PurchaseDetailModel,
                as: 'detalles_compra',
                include: {
                    model: ProductModel,
                    as: 'producto',
                }
            }]
        });

        if (!purchaseInvoice) {
            return res.status(404).send({ error: "Carrito de compras vacío." });
        }

        const inactivePurchaseInvoice = await StateModel.findOne({
            where: {
                nombre_estado: "Cancelado"
            }
        });

        if (!inactivePurchaseInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        for (const detail of purchaseInvoice.detalles_compra) {
            const product = await ProductModel.findByPk(detail.producto.id);

            if (product) {
                product.cantidad_stock -= detail.cantidad_producto;
                await product.save();
            }
        }

        purchaseInvoice.ID_Estado_FK = inactivePurchaseInvoice.id;
        await purchaseInvoice.save();

        res.status(200).send({ msg: "La compra ha sido cancelada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    createPurchaseInvoice,
    readPurchaseInvoiceProcess,
    deleteProductIdPurchaseInvoice,
    deletePurchaseInvoiceProcess
}