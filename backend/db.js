const sql = require('mssql');
const path = require('path');
require('dotenv').config();

// Parse DB_SERVER in case it has SQLEXPRESS/localhost format
let serverHost = process.env.DB_SERVER || 'SQLEXPRESS/localhost';
let instanceName = undefined;

if (serverHost.includes('/')) {
  const parts = serverHost.split('/');
  serverHost = parts[1];
  instanceName = parts[0];
} else if (serverHost.includes('\\')) {
  const parts = serverHost.split('\\');
  serverHost = parts[0];
  instanceName = parts[1];
}

const config = {
  user: process.env.DB_USER || 'devops',
  password: process.env.DB_PASSWORD || 'devops123',
  server: serverHost,
  database: process.env.DB_NAME || 'DevOps',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

if (instanceName) {
  config.options.instanceName = instanceName;
}

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(async pool => {
    console.log('Connected to MSSQL Database at', serverHost);
    await initializeDb(pool);
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
  });

async function initializeDb(pool) {
  try {
    // Check and create products
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='products' AND xtype='U')
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
      )
    `);

    // Comments
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='comments' AND xtype='U')
      CREATE TABLE comments (
        id INT PRIMARY KEY IDENTITY(1,1),
        product_id INT NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
        author NVARCHAR(255) NOT NULL,
        avatar NVARCHAR(MAX),
        rating INT NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Orders
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='orders' AND xtype='U')
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
      )
    `);

    // Order items
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='order_items' AND xtype='U')
      CREATE TABLE order_items (
        id INT PRIMARY KEY IDENTITY(1,1),
        order_id INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT NOT NULL,
        product_name NVARCHAR(255) NOT NULL,
        price FLOAT NOT NULL,
        quantity INT NOT NULL
      )
    `);

    // Users
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
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
      )
    `);

    // Contact Messages
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='contact_messages' AND xtype='U')
      CREATE TABLE contact_messages (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20),
        subject NVARCHAR(255) NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(50) DEFAULT 'New',
        created_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Seed Data
    const result = await pool.request().query("SELECT COUNT(*) as count FROM products");
    if (result.recordset[0].count === 0) {
      console.log('Seeding initial products data...');
      const sampleProducts = [
        { name: "MacBook Pro 16 M3 Max", category: "Laptop", price: 2499, oldPrice: 2699, rating: 4.9, stock: 15, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", description: "Sức mạnh vượt trội cho chuyên gia sáng tạo", specs: JSON.stringify(["Apple M3 Max Chip"]), featured: 1 },
        { name: "iPhone 15 Pro Max", category: "Smartphone", price: 1199, oldPrice: 1299, rating: 4.8, stock: 25, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", description: "Thiết kế vỏ Titanium hàng không nhẹ vượt trội", specs: JSON.stringify(["Chip A17 Pro 3nm"]), featured: 1 }
      ];

      for (const p of sampleProducts) {
        const req = pool.request();
        req.input('name', sql.NVARCHAR, p.name);
        req.input('category', sql.NVARCHAR, p.category);
        req.input('price', sql.FLOAT, p.price);
        req.input('oldPrice', sql.FLOAT, p.oldPrice);
        req.input('rating', sql.FLOAT, p.rating);
        req.input('stock', sql.INT, p.stock);
        req.input('image', sql.NVARCHAR, p.image);
        req.input('description', sql.NVARCHAR, p.description);
        req.input('specs', sql.NVARCHAR, p.specs);
        req.input('featured', sql.INT, p.featured);
        
        await req.query(`
          INSERT INTO products (name, category, price, oldPrice, rating, stock, image, description, specs, featured)
          VALUES (@name, @category, @price, @oldPrice, @rating, @stock, @image, @description, @specs, @featured)
        `);
      }
      console.log('Product seed data inserted successfully.');
    }
  } catch (err) {
    console.error('Error during DB Initialization:', err);
  }
}

module.exports = {
  sql,
  poolPromise
};
