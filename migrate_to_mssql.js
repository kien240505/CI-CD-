const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { poolPromise, sql } = require('./db');

async function migrate() {
  console.log('--- Starting Migration from SQLite to MSSQL ---');

  const sqliteDb = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

  const querySqlite = (query) => {
    return new Promise((resolve, reject) => {
      sqliteDb.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  try {
    const products = await querySqlite('SELECT * FROM products ORDER BY id ASC');
    const comments = await querySqlite('SELECT * FROM comments ORDER BY id ASC');
    const users = await querySqlite('SELECT * FROM users ORDER BY id ASC');
    const orders = await querySqlite('SELECT * FROM orders ORDER BY id ASC');
    const orderItems = await querySqlite('SELECT * FROM order_items ORDER BY id ASC');
    const contactMessages = await querySqlite('SELECT * FROM contact_messages ORDER BY id ASC');

    console.log(`Found in SQLite:
  - Products: ${products.length}
  - Comments: ${comments.length}
  - Users: ${users.length}
  - Orders: ${orders.length}
  - Order Items: ${orderItems.length}
  - Contact Messages: ${contactMessages.length}
    `);

    const pool = await poolPromise;

    console.log('Clearing existing records in MSSQL to ensure clean migration...');
    await pool.request().query(`
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM comments;
      DELETE FROM contact_messages;
      DELETE FROM products;
      DELETE FROM users;
    `);

    // 1. Insert Products
    if (products.length > 0) {
      console.log(`Migrating ${products.length} products...`);
      for (const p of products) {
        const req = pool.request();
        req.input('id', sql.INT, p.id);
        req.input('name', sql.NVARCHAR, p.name);
        req.input('category', sql.NVARCHAR, p.category);
        req.input('price', sql.FLOAT, p.price);
        req.input('oldPrice', sql.FLOAT, p.oldPrice);
        req.input('rating', sql.FLOAT, p.rating || 5.0);
        req.input('stock', sql.INT, p.stock !== undefined ? p.stock : 10);
        req.input('image', sql.NVARCHAR, p.image);
        req.input('description', sql.NVARCHAR, p.description);
        req.input('specs', sql.NVARCHAR, p.specs);
        req.input('featured', sql.INT, p.featured || 0);
        req.input('created_at', sql.NVARCHAR, p.created_at || new Date().toISOString());

        await req.query(`
          SET IDENTITY_INSERT products ON;
          INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured, created_at)
          VALUES (@id, @name, @category, @price, @oldPrice, @rating, @stock, @image, @description, @specs, @featured, @created_at);
          SET IDENTITY_INSERT products OFF;
        `);
      }
      console.log('Products migrated successfully.');
    }

    // 2. Insert Comments
    if (comments.length > 0) {
      console.log(`Migrating ${comments.length} comments...`);
      for (const c of comments) {
        const req = pool.request();
        req.input('id', sql.INT, c.id);
        req.input('product_id', sql.INT, c.product_id);
        req.input('author', sql.NVARCHAR, c.author);
        req.input('avatar', sql.NVARCHAR, c.avatar);
        req.input('rating', sql.INT, c.rating);
        req.input('content', sql.NVARCHAR, c.content);
        req.input('created_at', sql.NVARCHAR, c.created_at || new Date().toISOString());

        await req.query(`
          SET IDENTITY_INSERT comments ON;
          INSERT INTO comments (id, product_id, author, avatar, rating, content, created_at)
          VALUES (@id, @product_id, @author, @avatar, @rating, @content, @created_at);
          SET IDENTITY_INSERT comments OFF;
        `);
      }
      console.log('Comments migrated successfully.');
    }

    // 3. Insert Users
    if (users.length > 0) {
      console.log(`Migrating ${users.length} users...`);
      for (const u of users) {
        const req = pool.request();
        req.input('id', sql.INT, u.id);
        req.input('fullname', sql.NVARCHAR, u.fullname);
        req.input('email', sql.NVARCHAR, u.email);
        req.input('phone', sql.NVARCHAR, u.phone || '');
        req.input('password', sql.NVARCHAR, u.password);
        req.input('avatar', sql.NVARCHAR, u.avatar || '');
        req.input('role', sql.NVARCHAR, u.role || 'user');
        req.input('reset_token', sql.NVARCHAR, u.reset_token || null);
        req.input('created_at', sql.NVARCHAR, u.created_at || new Date().toISOString());

        await req.query(`
          SET IDENTITY_INSERT users ON;
          INSERT INTO users (id, fullname, email, phone, password, avatar, role, reset_token, created_at)
          VALUES (@id, @fullname, @email, @phone, @password, @avatar, @role, @reset_token, @created_at);
          SET IDENTITY_INSERT users OFF;
        `);
      }
      console.log('Users migrated successfully.');
    }

    // 4. Insert Orders & Order Items if any
    if (orders.length > 0) {
      console.log(`Migrating ${orders.length} orders...`);
      for (const o of orders) {
        const req = pool.request();
        req.input('id', sql.INT, o.id);
        req.input('customer_name', sql.NVARCHAR, o.customer_name);
        req.input('email', sql.NVARCHAR, o.email);
        req.input('phone', sql.NVARCHAR, o.phone);
        req.input('address', sql.NVARCHAR, o.address);
        req.input('payment_method', sql.NVARCHAR, o.payment_method);
        req.input('total_amount', sql.FLOAT, o.total_amount);
        req.input('status', sql.NVARCHAR, o.status);
        req.input('payment_status', sql.NVARCHAR, o.payment_status);
        req.input('created_at', sql.NVARCHAR, o.created_at || new Date().toISOString());

        await req.query(`
          SET IDENTITY_INSERT orders ON;
          INSERT INTO orders (id, customer_name, email, phone, address, payment_method, total_amount, status, payment_status, created_at)
          VALUES (@id, @customer_name, @email, @phone, @address, @payment_method, @total_amount, @status, @payment_status, @created_at);
          SET IDENTITY_INSERT orders OFF;
        `);
      }
      console.log('Orders migrated successfully.');
    }

    if (orderItems.length > 0) {
      console.log(`Migrating ${orderItems.length} order items...`);
      for (const item of orderItems) {
        const req = pool.request();
        req.input('id', sql.INT, item.id);
        req.input('order_id', sql.INT, item.order_id);
        req.input('product_id', sql.INT, item.product_id);
        req.input('product_name', sql.NVARCHAR, item.product_name);
        req.input('price', sql.FLOAT, item.price);
        req.input('quantity', sql.INT, item.quantity);

        await req.query(`
          SET IDENTITY_INSERT order_items ON;
          INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity)
          VALUES (@id, @order_id, @product_id, @product_name, @price, @quantity);
          SET IDENTITY_INSERT order_items OFF;
        `);
      }
      console.log('Order items migrated successfully.');
    }

    // 5. Insert Contact Messages if any
    if (contactMessages.length > 0) {
      console.log(`Migrating ${contactMessages.length} contact messages...`);
      for (const m of contactMessages) {
        const req = pool.request();
        req.input('id', sql.INT, m.id);
        req.input('name', sql.NVARCHAR, m.name);
        req.input('email', sql.NVARCHAR, m.email);
        req.input('phone', sql.NVARCHAR, m.phone || '');
        req.input('subject', sql.NVARCHAR, m.subject);
        req.input('message', sql.NVARCHAR, m.message);
        req.input('status', sql.NVARCHAR, m.status || 'New');
        req.input('created_at', sql.NVARCHAR, m.created_at || new Date().toISOString());

        await req.query(`
          SET IDENTITY_INSERT contact_messages ON;
          INSERT INTO contact_messages (id, name, email, phone, subject, message, status, created_at)
          VALUES (@id, @name, @email, @phone, @subject, @message, @status, @created_at);
          SET IDENTITY_INSERT contact_messages OFF;
        `);
      }
      console.log('Contact messages migrated successfully.');
    }

    // Generate SQL script file for SSMS backup / manual run
    let sqlScript = `-- ========================================================
-- DATABASE SCRIPT FOR SQL SERVER (DevOps / e-commerce)
-- Generated automatically on ${new Date().toLocaleString()}
-- ========================================================

USE DevOps;
GO

-- Drop tables if needed (reverse order of FK)
IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('comments', 'U') IS NOT NULL DROP TABLE comments;
IF OBJECT_ID('products', 'U') IS NOT NULL DROP TABLE products;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('contact_messages', 'U') IS NOT NULL DROP TABLE contact_messages;
GO

-- Create Tables
CREATE TABLE products (
  id INT PRIMARY KEY IDENTITY(1,1),
  name NVARCHAR(MAX) NOT NULL,
  category NVARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  oldPrice FLOAT,
  rating FLOAT DEFAULT 5.0,
  stock INT DEFAULT 10,
  image NVARCHAR(MAX) NOT NULL,
  description NVARCHAR(MAX) NOT NULL,
  specs NVARCHAR(MAX),
  featured INT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE comments (
  id INT PRIMARY KEY IDENTITY(1,1),
  product_id INT NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
  author NVARCHAR(255) NOT NULL,
  avatar NVARCHAR(MAX),
  rating INT NOT NULL,
  content NVARCHAR(MAX) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE orders (
  id INT PRIMARY KEY IDENTITY(1,1),
  customer_name NVARCHAR(255) NOT NULL,
  email NVARCHAR(255) NOT NULL,
  phone NVARCHAR(20) NOT NULL,
  address NVARCHAR(MAX) NOT NULL,
  payment_method NVARCHAR(50) NOT NULL,
  total_amount FLOAT NOT NULL,
  status NVARCHAR(50) DEFAULT 'Pending',
  payment_status NVARCHAR(50) DEFAULT 'Unpaid',
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE order_items (
  id INT PRIMARY KEY IDENTITY(1,1),
  order_id INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL,
  product_name NVARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  quantity INT NOT NULL
);
GO

CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY(1,1),
  fullname NVARCHAR(255) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE,
  phone NVARCHAR(20),
  password NVARCHAR(255) NOT NULL,
  avatar NVARCHAR(MAX),
  role NVARCHAR(50) DEFAULT 'user',
  reset_token NVARCHAR(255),
  reset_token_expiry DATETIME,
  created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE contact_messages (
  id INT PRIMARY KEY IDENTITY(1,1),
  name NVARCHAR(255) NOT NULL,
  email NVARCHAR(255) NOT NULL,
  phone NVARCHAR(20),
  subject NVARCHAR(255) NOT NULL,
  message NVARCHAR(MAX) NOT NULL,
  status NVARCHAR(50) DEFAULT 'New',
  created_at DATETIME DEFAULT GETDATE()
);
GO

`;

    const esc = (val) => {
      if (val === null || val === undefined) return 'NULL';
      return "N'" + String(val).replace(/'/g, "''") + "'";
    };

    if (products.length > 0) {
      sqlScript += `SET IDENTITY_INSERT products ON;\n`;
      for (const p of products) {
        sqlScript += `INSERT INTO products (id, name, category, price, oldPrice, rating, stock, image, description, specs, featured) VALUES (${p.id}, ${esc(p.name)}, ${esc(p.category)}, ${p.price}, ${p.oldPrice !== null ? p.oldPrice : 'NULL'}, ${p.rating || 5.0}, ${p.stock !== undefined ? p.stock : 10}, ${esc(p.image)}, ${esc(p.description)}, ${esc(p.specs)}, ${p.featured || 0});\n`;
      }
      sqlScript += `SET IDENTITY_INSERT products OFF;\nGO\n\n`;
    }

    if (comments.length > 0) {
      sqlScript += `SET IDENTITY_INSERT comments ON;\n`;
      for (const c of comments) {
        sqlScript += `INSERT INTO comments (id, product_id, author, avatar, rating, content) VALUES (${c.id}, ${c.product_id}, ${esc(c.author)}, ${esc(c.avatar)}, ${c.rating}, ${esc(c.content)});\n`;
      }
      sqlScript += `SET IDENTITY_INSERT comments OFF;\nGO\n\n`;
    }

    if (users.length > 0) {
      sqlScript += `SET IDENTITY_INSERT users ON;\n`;
      for (const u of users) {
        sqlScript += `INSERT INTO users (id, fullname, email, phone, password, avatar, role, reset_token) VALUES (${u.id}, ${esc(u.fullname)}, ${esc(u.email)}, ${esc(u.phone)}, ${esc(u.password)}, ${esc(u.avatar)}, ${esc(u.role)}, ${esc(u.reset_token)});\n`;
      }
      sqlScript += `SET IDENTITY_INSERT users OFF;\nGO\n\n`;
    }

    fs.writeFileSync(path.join(__dirname, 'database_mssql.sql'), sqlScript, 'utf8');
    console.log('Exported database_mssql.sql successfully!');

    // Verification
    const countP = await pool.request().query('SELECT COUNT(*) as count FROM products');
    const countC = await pool.request().query('SELECT COUNT(*) as count FROM comments');
    const countU = await pool.request().query('SELECT COUNT(*) as count FROM users');

    console.log(`\n=== Migration Verification in MSSQL ===
Products: ${countP.recordset[0].count}
Comments: ${countC.recordset[0].count}
Users:    ${countU.recordset[0].count}
=======================================
Migration Completed Successfully!`);

    sqliteDb.close();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    sqliteDb.close();
    process.exit(1);
  }
}

migrate();
