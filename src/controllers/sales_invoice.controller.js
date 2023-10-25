const SalesInvoiceModel = require('../models/sales_invoice');
const SalesDetailModel = require('../models/sales_detail');
const ProductModel = require('../models/product');
const EmployeeModel = require('../models/employee');
const InventoryModel = require('../models/inventory');
const StateModel = require('../models/state');

/**
 * Función para ver todas las ventas
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Empleado (employee.js),
 *              Modelo Estado (state.js)
 */

const readSalesInvoices = async (req, res) => {
    try {
        const { query } = req;
        const where = {};

        if (query.estado) {
            const stateSalesInvoice = await StateModel.findOne({
                where: {
                    nombre_estado: query.estado
                }
            });

            if (!stateSalesInvoice) {
                return res.status(404).send({ error: "Estado no encontrado." });
            }

            where.ID_Estado_FK = stateSalesInvoice.id
        }

        const salesInvoice = await SalesInvoiceModel.findAll({
            where,
            attributes: ['id', 'numero_orden', 'total_factura'],
            include: [{
                model: EmployeeModel,
                as: 'empleado',
                attributes: ['id', 'nombre', 'apellido']
            },{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'nombre_estado']
            }]
        });

        if (salesInvoice.length === 0) {
            return res.status(404).send({ error: "No hay ninguna venta registrada." });
        }

        res.status(200).send({ salesInvoice });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver el detalle de venta por id
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js)
 *              Modelo Estado (state.js)
 */

const readSalesInvoiceId = async (req, res) => {
    try {
        const { id } = req.params;

        const salesInvoice = await SalesInvoiceModel.findByPk(id, {
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

        if (!salesInvoice) {
            return res.status(404).send({ error: "Detalle de venta no encontrado." });
        }

        res.status(200).send({ salesInvoice });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para cambiar estado de la venta (pendiente -> en proceso)
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js)
 *              Modelo Estado (state.js)
 */

const changeSalesInvoiceProcess = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const stateSalesInvoice = await StateModel.findOne({
            where: {
                nombre_estado: 'Pendiente'
            }
        });

        if (!stateSalesInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const salesInvoice = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Estado_FK: stateSalesInvoice.id
            }
        });

        if (!salesInvoice) {
            return res.status(404).send({ error: "Venta no encontrada." });
        }

        const changeSalesStatus = await StateModel.findOne({ 
            where: { 
                nombre_estado: "En proceso" 
            } 
        });

        if (!changeSalesStatus) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        salesInvoice.ID_Estado_FK = changeSalesStatus.id;
        salesInvoice.ID_Empleado_FK = user.id;
        await salesInvoice.save();

        //*************Se podría implementar una lógica para enviar el correo de que ya fue completado su pedido */
        res.status(200).send({ msg: "Venta en proceso." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para cambiar estado de la venta y generar inventario (en proceso -> completo)
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Factura_Venta (sales_invoice.js), 
 *              Modelo Detalle_Venta (sales_detail.js),
 *              Modelo Producto (product.js),
 *              Modelo Estado (state.js)
 */

const changeSalesInvoiceComplete = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const stateSalesInvoice = await StateModel.findOne({
            where: {
                nombre_estado: "En proceso"
            }
        });

        if (!stateSalesInvoice) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const salesInvoice = await SalesInvoiceModel.findOne({
            where: {
                id,
                ID_Empleado_FK: user.id,
                ID_Estado_FK: stateSalesInvoice.id
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

        if (!salesInvoice) {
            return res.status(404).send({ error: "Venta no encontrada." });
        }

        const changeSalesStatus = await StateModel.findOne({
            where: {
                nombre_estado: "Completado"
            }
        });

        if (!changeSalesStatus) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        for (const salesDetail of salesInvoice.detalles_venta) {
            const product = await ProductModel.findByPk(salesDetail.producto.id);

            if (product) {
                const inventoryEntry = await InventoryModel.create({
                    tipo_movimiento: 'Venta',
                    cantidad_movimiento: salesDetail.cantidad_producto,
                    monto_movimiento: salesInvoice.total_factura,
                    ID_Empleado_FK: user.id,
                    ID_Producto_FK: product.id,
                });

                if (!inventoryEntry) {
                    return res.status(500).send({ error: "Error al crear el registro de inventario." });
                }
            }
        }

        salesInvoice.ID_Estado_FK = changeSalesStatus.id;
        await salesInvoice.save();

        //*************Se podría implementar una lógica para enviar el correo de que ya fue completado su pedido */
        res.status(200).send({ msg: "Venta completada." });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    readSalesInvoices,
    readSalesInvoiceId,
    changeSalesInvoiceProcess,
    changeSalesInvoiceComplete
}