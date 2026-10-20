const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  const { category, search, sort, featured } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const request = (await poolPromise).request();

  if (category && category !== 'All') {
    query += ' AND category = @category';
    request.input('category', sql.NVARCHAR, category);
  }

  if (search) {
    query += ' AND (name LIKE @search OR description LIKE @search)';
    request.input('search', sql.NVARCHAR, `%${search}%`);
  }

  if (featured === '1') {
    query += ' AND featured = 1';
  }

  if (sort === 'price-asc') {
    query += ' ORDER BY price ASC';
  } else if (sort === 'price-desc') {
    query += ' ORDER BY price DESC';
  } else if (sort === 'rating') {
    query += ' ORDER BY rating DESC';
  } else {
    query += ' ORDER BY id DESC';
  }

  try {
    const result = await request.query(query);
    const products = result.recordset.map(p => ({
      ...p,
      specs: p.specs ? JSON.parse(p.specs) : []
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT DISTINCT category FROM products');
    const categories = ['All', ...result.recordset.map(r => r.category)];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const pool = await poolPromise;
    const prodResult = await pool.request()
      .input('id', sql.INT, productId)
      .query('SELECT * FROM products WHERE id = @id');
      
    const product = prodResult.recordset[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.specs = product.specs ? JSON.parse(product.specs) : [];

    const commentsResult = await pool.request()
      .input('id', sql.INT, productId)
      .query('SELECT * FROM comments WHERE product_id = @id ORDER BY id DESC');
      
    res.json({ ...product, comments: commentsResult.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  const productId = req.params.id;
  const { author, rating, content, avatar } = req.body;

  if (!author || !rating || !content) {
    return res.status(400).json({ error: 'Author, rating and content are required' });
  }

  const defaultAvatar = avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(author)}`;

  try {
    const pool = await poolPromise;
    const insertResult = await pool.request()
      .input('product_id', sql.INT, productId)
      .input('author', sql.NVARCHAR, author)
      .input('avatar', sql.NVARCHAR, defaultAvatar)
      .input('rating', sql.INT, Number(rating))
      .input('content', sql.NVARCHAR, content)
      .query(`
        INSERT INTO comments (product_id, author, avatar, rating, content) 
        OUTPUT INSERTED.*
        VALUES (@product_id, @author, @avatar, @rating, @content)
      `);

    const newComment = insertResult.recordset[0];

    const avgResult = await pool.request()
      .input('product_id', sql.INT, productId)
      .query('SELECT AVG(CAST(rating AS FLOAT)) as avgRating FROM comments WHERE product_id = @product_id');

    if (avgResult.recordset[0].avgRating) {
      const newAvg = parseFloat(avgResult.recordset[0].avgRating.toFixed(1));
      await pool.request()
        .input('rating', sql.FLOAT, newAvg)
        .input('product_id', sql.INT, productId)
        .query('UPDATE products SET rating = @rating WHERE id = @product_id');
    }

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, category, price, oldPrice, stock, image, description, specs, featured } = req.body;

  if (!name || !category || !price || !image) {
    return res.status(400).json({ error: 'Name, category, price and image are required' });
  }

  const specsString = Array.isArray(specs) ? JSON.stringify(specs) : JSON.stringify([]);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVARCHAR, name)
      .input('category', sql.NVARCHAR, category)
      .input('price', sql.FLOAT, Number(price))
      .input('oldPrice', sql.FLOAT, oldPrice ? Number(oldPrice) : null)
      .input('stock', sql.INT, stock ? Number(stock) : 10)
      .input('image', sql.NVARCHAR, image)
      .input('description', sql.NVARCHAR, description || '')
      .input('specs', sql.NVARCHAR, specsString)
      .input('featured', sql.INT, featured ? 1 : 0)
      .query(`
        INSERT INTO products (name, category, price, oldPrice, stock, image, description, specs, featured)
        OUTPUT INSERTED.id
        VALUES (@name, @category, @price, @oldPrice, @stock, @image, @description, @specs, @featured)
      `);
      
    res.status(201).json({ id: result.recordset[0].id, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, category, price, oldPrice, stock, image, description, specs, featured } = req.body;
  const productId = req.params.id;

  const specsString = Array.isArray(specs) ? JSON.stringify(specs) : JSON.stringify([]);

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.NVARCHAR, name)
      .input('category', sql.NVARCHAR, category)
      .input('price', sql.FLOAT, Number(price))
      .input('oldPrice', sql.FLOAT, oldPrice ? Number(oldPrice) : null)
      .input('stock', sql.INT, Number(stock))
      .input('image', sql.NVARCHAR, image)
      .input('description', sql.NVARCHAR, description)
      .input('specs', sql.NVARCHAR, specsString)
      .input('featured', sql.INT, featured ? 1 : 0)
      .input('id', sql.INT, productId)
      .query(`
        UPDATE products SET name = @name, category = @category, price = @price, oldPrice = @oldPrice, 
        stock = @stock, image = @image, description = @description, specs = @specs, featured = @featured
        WHERE id = @id
      `);
      
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const productId = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.INT, productId)
      .query('DELETE FROM products WHERE id = @id');
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
