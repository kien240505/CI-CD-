const { poolPromise, sql } = require('../db');

exports.createOrder = async (req, res) => {
  const { customer_name, email, phone, address, payment_method, items, total_amount } = req.body;

  if (!customer_name || !email || !phone || !address || !items || !items.length) {
    return res.status(400).json({ error: 'Incomplete order details or empty cart' });
  }

  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);
      request.input('customer_name', sql.NVARCHAR, customer_name);
      request.input('email', sql.NVARCHAR, email);
      request.input('phone', sql.NVARCHAR, phone);
      request.input('address', sql.NVARCHAR, address);
      request.input('payment_method', sql.NVARCHAR, payment_method || 'COD');
      request.input('total_amount', sql.FLOAT, Number(total_amount));

      const orderResult = await request.query(`
        INSERT INTO orders (customer_name, email, phone, address, payment_method, total_amount, status, payment_status)
        OUTPUT INSERTED.id
        VALUES (@customer_name, @email, @phone, @address, @payment_method, @total_amount, 'Pending', 'Unpaid')
      `);

      const orderId = orderResult.recordset[0].id;

      for (const item of items) {
        const itemRequest = new sql.Request(transaction);
        itemRequest.input('order_id', sql.INT, orderId);
        itemRequest.input('product_id', sql.INT, item.id);
        itemRequest.input('product_name', sql.NVARCHAR, item.name);
        itemRequest.input('price', sql.FLOAT, item.price);
        itemRequest.input('quantity', sql.INT, item.quantity);

        await itemRequest.query(`
          INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
          VALUES (@order_id, @product_id, @product_name, @price, @quantity)
        `);

        const stockRequest = new sql.Request(transaction);
        stockRequest.input('quantity', sql.INT, item.quantity);
        stockRequest.input('product_id', sql.INT, item.id);
        await stockRequest.query(`
          UPDATE products SET stock = CASE WHEN stock - @quantity < 0 THEN 0 ELSE stock - @quantity END WHERE id = @product_id
        `);
      }

      await transaction.commit();
      res.status(201).json({
        orderId,
        message: 'Order created successfully!',
        total_amount,
        payment_method: payment_method || 'COD'
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const ordersResult = await pool.request().query('SELECT * FROM orders ORDER BY id DESC');
    const orders = ordersResult.recordset;

    if (orders.length === 0) return res.json([]);

    for (const order of orders) {
      const itemsResult = await pool.request()
        .input('order_id', sql.INT, order.id)
        .query('SELECT * FROM order_items WHERE order_id = @order_id');
      order.items = itemsResult.recordset || [];
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('status', sql.NVARCHAR, status)
      .input('id', sql.INT, orderId)
      .query('UPDATE orders SET status = @status WHERE id = @id');

    res.json({ message: `Order #${orderId} status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.processPayment = async (req, res) => {
  const orderId = req.params.id;
  const { payment_gateway } = req.body; 

  if (!payment_gateway) return res.status(400).json({ error: 'Payment gateway is required' });

  try {
    const pool = await poolPromise;
    const orderResult = await pool.request()
      .input('id', sql.INT, orderId)
      .query('SELECT * FROM orders WHERE id = @id');
      
    const order = orderResult.recordset[0];

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.payment_status === 'Paid') return res.status(400).json({ error: 'Order is already paid' });

    await pool.request()
      .input('gateway', sql.NVARCHAR, payment_gateway)
      .input('id', sql.INT, orderId)
      .query("UPDATE orders SET payment_status = 'Paid', payment_method = @gateway WHERE id = @id");

    res.json({ message: `Payment processed successfully via ${payment_gateway} for Order #${orderId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
