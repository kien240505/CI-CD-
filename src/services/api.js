const API_BASE_URL = '/api';

// Rich Products List for Standalone Mode & Offline Fallback
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "MacBook Pro 16 M3 Max",
    category: "Laptop",
    price: 2499,
    oldPrice: 2699,
    rating: 4.9,
    stock: 15,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    description: "Sức mạnh vượt trội cho chuyên gia sáng tạo với chip M3 Max 16-Core CPU, 40-Core GPU và màn hình Liquid Retina XDR sắc nét.",
    specs: ["Apple M3 Max Chip", "36GB Unified Memory", "1TB SSD Storage", "16.2-inch XDR Display", "Up to 22h battery"],
    featured: 1,
    comments: [
      { id: 101, author: "Nguyễn Văn An", avatar: "https://i.pravatar.cc/150?img=11", rating: 5, content: "Sản phẩm mượt mà, màn hình XDR siêu đỉnh!", created_at: new Date().toISOString() },
      { id: 102, author: "Trần Thị Mai", avatar: "https://i.pravatar.cc/150?img=32", rating: 5, content: "Đóng gói cẩn thận, dùng đồ họa cực mượt.", created_at: new Date().toISOString() }
    ]
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max Titanium",
    category: "Smartphone",
    price: 1199,
    oldPrice: 1299,
    rating: 4.8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    description: "Thiết kế vỏ Titanium hàng không nhẹ vượt trội, nút Action linh hoạt và cụm camera zoom quang học 5x sắc nét tuyệt đối.",
    specs: ["Chip A17 Pro 3nm", "Camera chính 48MP", "Zoom quang 5x", "Titanium Grade 5", "USB-C 3.0"],
    featured: 1,
    comments: [
      { id: 103, author: "Lê Hoàng Minh", avatar: "https://i.pravatar.cc/150?img=68", rating: 5, content: "Vỏ titan rất nhẹ, cầm đầm tay!", created_at: new Date().toISOString() }
    ]
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 ANC",
    category: "Audio",
    price: 349,
    oldPrice: 399,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Tai nghe chống ồn chủ động hàng đầu thế giới với 8 micro kép, màng loa 30mm đặc biệt và thời lượng pin 30 giờ.",
    specs: ["Industry-leading ANC", "Hi-Res Audio LDAC", "30-hour Battery", "Speak-to-Chat", "Multi-point Bluetooth"],
    featured: 1,
    comments: []
  },
  {
    id: 4,
    name: "Dell UltraSharp 32 4K USB-C Hub Monitor",
    category: "Monitor",
    price: 799,
    oldPrice: 899,
    rating: 4.6,
    stock: 2,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "Màn hình đồ họa chuẩn IPS Black 4K HDR400, độ phủ màu 100% sRGB & DCI-P3 98%, cổng sạc USB-C 90W tiện lợi.",
    specs: ["32-inch 4K UHD", "IPS Black Technology", "DCI-P3 98%", "USB-C Hub 90W Power", "Ergonomic Stand"],
    featured: 0,
    comments: []
  },
  {
    id: 5,
    name: "Logitech MX Master 3S Wireless Mouse",
    category: "Accessory",
    price: 99,
    oldPrice: 119,
    rating: 4.9,
    stock: 50,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    description: "Chuột không dây công xưởng công nghệ với cảm biến 8K DPI Quiet Clicks và con cuộn siêu tốc MagSpeed.",
    specs: ["8000 DPI Optical", "Quiet Click buttons", "MagSpeed Scroll", "Bluetooth & Logi Bolt", "USB-C Quick Charge"],
    featured: 1,
    comments: []
  },
  {
    id: 6,
    name: "iPad Pro 13 M4 Ultra-Thin",
    category: "Tablet",
    price: 1299,
    oldPrice: 1399,
    rating: 4.9,
    stock: 20,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    description: "Mỏng kinh ngạc chỉ 5.1mm với màn hình Tandem OLED Ultra Retina XDR siêu nét và sức mạnh đột phá từ chip M4.",
    specs: ["Chip Apple M4", "Ultra Retina XDR OLED", "Thickness 5.1mm", "Apple Pencil Pro Support", "Thunderbolt 4 / USB 4"],
    featured: 1,
    comments: []
  },
  {
    id: 7,
    name: "Samsung Galaxy S24 Ultra 5G AI",
    category: "Smartphone",
    price: 1299,
    oldPrice: 1399,
    rating: 4.8,
    stock: 18,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    description: "Quyền năng Galaxy AI tích hợp, bút S-Pen thông minh, khung viền Titanium và camera 200MP bắt trọn khoảnh khắc đêm.",
    specs: ["Snapdragon 8 Gen 3 for Galaxy", "Camera 200MP AI", "Bút S-Pen tích hợp", "Màn hình Dynamic AMOLED 2X 120Hz", "Khung Titanium"],
    featured: 1,
    comments: [
      { id: 104, author: "Đỗ Quốc Bảo", avatar: "https://i.pravatar.cc/150?img=53", rating: 5, content: "Tính năng Circle to Search và AI dịch thuật rất tiện lợi!", created_at: new Date().toISOString() }
    ]
  },
  {
    id: 8,
    name: "Asus ROG Zephyrus G16 OLED Gaming Laptop",
    category: "Laptop",
    price: 1999,
    oldPrice: 2199,
    rating: 4.9,
    stock: 8,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    description: "Laptop gaming mỏng nhẹ cao cấp nhất trang bị màn hình ROG Nebula OLED 240Hz, card đồ họa RTX 4070 và chip Intel Core Ultra 9.",
    specs: ["Intel Core Ultra 9 185H", "NVIDIA RTX 4070 8GB", "16-inch ROG Nebula OLED 2.5K 240Hz", "32GB LPDDR5X RAM", "Vỏ Nhôm CNC cao cấp"],
    featured: 1,
    comments: []
  },
  {
    id: 9,
    name: "Bose QuietComfort Ultra Headphones",
    category: "Audio",
    price: 379,
    oldPrice: 429,
    rating: 4.8,
    stock: 22,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    description: "Trải nghiệm âm thanh vòm không gian Bose Immersive Audio đỉnh cao, chống ồn cá nhân hóa CustomTune và đệm tai êm ái.",
    specs: ["Bose Immersive Audio", "CustomTune Technology", "Quiet & Aware Modes", "Up to 24h Battery", "Multipoint Connection"],
    featured: 0,
    comments: []
  },
  {
    id: 10,
    name: "Keychron Q1 Max Wireless Mechanical Keyboard",
    category: "Accessory",
    price: 219,
    oldPrice: 239,
    rating: 4.8,
    stock: 14,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    description: "Bàn phím cơ CNC Nhôm nguyên khối, Gasket Mount êm ái, hỗ trợ kết nối 2.4Ghz siêu tốc và tùy chỉnh VIA/QMK.",
    specs: ["Full Aluminum Body", "2.4Ghz & Bluetooth 5.1", "Hot-swappable Switches", "South-facing RGB", "QMK/VIA Programmable"],
    featured: 0,
    comments: []
  },
  {
    id: 11,
    name: "Apple Watch Ultra 2 Titanium",
    category: "Smartwatch",
    price: 799,
    oldPrice: 849,
    rating: 4.8,
    stock: 12,
    image: "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80",
    description: "Đồng hồ thể thao chuyên nghiệp với màn hình sáng nhất 3000 nits, định vị GPS kép chuẩn xác và đo độ sâu chống nước 100m.",
    specs: ["S9 SiP Chip", "3000 nits OLED Display", "Precision Dual GPS", "100m Water Resistant", "36 Hours Battery"],
    featured: 0,
    comments: []
  },
  {
    id: 12,
    name: "Sony PlayStation 5 Pro Console",
    category: "Accessory",
    price: 699,
    oldPrice: 749,
    rating: 4.9,
    stock: 10,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    description: "Máy chơi game console thế hệ mới đỉnh cao hỗ trợ PlayStation Spectral Super Resolution (PSSR), Ray Tracing nâng cấp và SSD 2TB.",
    specs: ["Custom AMD RDNA Graphics", "2TB Ultra-Speed SSD", "PSSR AI Upscaling", "Advanced Ray Tracing", "DualSense Wireless Controller"],
    featured: 1,
    comments: [
      { id: 105, author: "Vũ Tiến Đạt", avatar: "https://i.pravatar.cc/150?img=12", rating: 5, content: "Chơi GTA V và Black Myth Wukong 60fps siêu mượt!", created_at: new Date().toISOString() }
    ]
  },
  {
    id: 13,
    name: "LG Smart Monitor 32-inch 4K HDR",
    category: "Monitor",
    price: 499,
    oldPrice: 599,
    rating: 4.6,
    stock: 16,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    description: "Màn hình thông minh tích hợp hệ điều hành webOS, điều khiển từ xa, loa kép 10W và kết nối AirPlay 2 không dây.",
    specs: ["32-inch 4K UHD VA Display", "webOS Smart TV built-in", "AirPlay 2 & Screen Share", "USB-C 65W Charging", "Magic Remote Included"],
    featured: 0,
    comments: []
  },
  {
    id: 14,
    name: "Canon EOS R6 Mark II Mirrorless Camera",
    category: "Accessory",
    price: 2499,
    oldPrice: 2699,
    rating: 4.9,
    stock: 5,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    description: "Máy ảnh Full-frame chuyên nghiệp với cảm biến CMOS 24.2MP, lấy nét Dual Pixel CMOS AF II nhận diện AI và quay video 4K 60p không giới hạn.",
    specs: ["24.2MP Full-Frame CMOS", "Dual Pixel CMOS AF II with AI", "4K 60p Uncropped Video", "Up to 40 fps Electronic Shutter", "In-Body Image Stabilization (IBIS)"],
    featured: 0,
    comments: []
  },
  {
    id: 15,
    name: "Samsung Galaxy Tab S9 Ultra 14.6\"",
    category: "Tablet",
    price: 1099,
    oldPrice: 1199,
    rating: 4.8,
    stock: 11,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
    description: "Máy tính bảng màn hình khổng lồ 14.6 inch Dynamic AMOLED 2X, đi kèm bút S-Pen chống nước IP68 và chế độ Samsung DeX đa nhiệm như máy tính.",
    specs: ["14.6-inch Dynamic AMOLED 2X", "Snapdragon 8 Gen 2", "IP68 Water & Dust Resistant", "S-Pen Included", "11,200mAh Battery"],
    featured: 0,
    comments: []
  },
  {
    id: 16,
    name: "Garmin Fenix 7X Pro Sapphire Solar",
    category: "Smartwatch",
    price: 899,
    oldPrice: 999,
    rating: 4.9,
    stock: 7,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Đồng hồ thám hiểm sạc pin năng lượng mặt trời Power Sapphire, đèn pin LED tích hợp và bản đồ TopoActive đa lục địa.",
    specs: ["Power Sapphire Solar Charging Lens", "Built-in LED Flashlight", "Multi-Band GPS Navigation", "Endurance Score & Hill Score", "Up to 37 days Battery"],
    featured: 1,
    comments: []
  }
];

let localProducts = [...MOCK_PRODUCTS];
let localOrders = [
  {
    id: 1001,
    customer_name: "Phạm Văn Đức",
    email: "duc.pham@gmail.com",
    phone: "0912 345 678",
    address: "78 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    payment_method: "COD",
    total_amount: 2499,
    status: "Delivered",
    created_at: new Date().toISOString()
  },
  {
    id: 1002,
    customer_name: "Trần Bảo Ngọc",
    email: "baongoc@gmail.com",
    phone: "0987 112 334",
    address: "15 Lê Lợi, Quận 1, TP Hồ Chí Minh",
    payment_method: "Banking",
    total_amount: 1199,
    status: "Processing",
    created_at: new Date().toISOString()
  }
];
let localMessages = [
  {
    id: 1,
    name: "Hoàng Anh",
    email: "hoanganh@gmail.com",
    phone: "0988 111 222",
    subject: "Tư vấn mua hàng",
    message: "Shop cho mình hỏi MacBook Pro M3 Max có sẵn màu Space Black không?",
    created_at: new Date().toISOString()
  }
];

// Helper to attempt fetch, or fallback to mock
const fetchOrFallback = async (url, options, fallbackFn) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('API Response Error');
    return await res.json();
  } catch (err) {
    console.warn(`[Offline Fallback Mode] Backend unavailable at ${url}. Using local fallback.`, err);
    return fallbackFn();
  }
};

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.featured) params.append('featured', '1');

  return fetchOrFallback(
    `${API_BASE_URL}/products?${params.toString()}`,
    {},
    () => {
      let result = [...localProducts];
      if (filters.category && filters.category !== 'All') {
        result = result.filter(p => p.category === filters.category);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }
      if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
      else if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
      else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
      return result;
    }
  );
};

export const fetchCategories = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/categories`,
    {},
    () => ['All', ...new Set(localProducts.map(p => p.category))]
  );
};

export const fetchProductDetail = async (id) => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/${id}`,
    {},
    () => {
      const prod = localProducts.find(p => p.id === Number(id)) || localProducts[0];
      return { ...prod, comments: prod.comments || [] };
    }
  );
};

export const addProductComment = async (productId, commentData) => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/${productId}/comments`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    },
    () => {
      const prod = localProducts.find(p => p.id === Number(productId));
      const newComment = {
        id: Date.now(),
        product_id: Number(productId),
        author: commentData.author,
        avatar: commentData.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(commentData.author)}`,
        rating: Number(commentData.rating),
        content: commentData.content,
        created_at: new Date().toISOString()
      };
      if (prod) {
        if (!prod.comments) prod.comments = [];
        prod.comments.unshift(newComment);
      }
      return newComment;
    }
  );
};

export const createOrder = async (orderData) => {
  return fetchOrFallback(
    `${API_BASE_URL}/orders`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    },
    () => {
      const newOrderId = Math.floor(1000 + Math.random() * 9000);
      const newOrder = {
        id: newOrderId,
        customer_name: orderData.customer_name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        payment_method: orderData.payment_method || 'COD',
        total_amount: orderData.total_amount,
        status: 'Pending',
        created_at: new Date().toISOString()
      };
      localOrders.unshift(newOrder);
      return { orderId: newOrderId, message: 'Order created successfully!' };
    }
  );
};

export const fetchAdminStats = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/admin/stats`,
    {},
    () => {
      const totalRevenue = localOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const lowStock = localProducts.filter(p => p.stock <= 3).length;
      return {
        totalProducts: localProducts.length,
        lowStock,
        totalOrders: localOrders.length,
        totalRevenue
      };
    }
  );
};

export const adminLogin = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại');
    return data;
  } catch (err) {
    console.warn("[Offline Admin Login Fallback]", err);
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        token: 'mock_token_' + Date.now(),
        admin: { username: 'admin', role: 'SuperAdmin' },
        message: 'Đăng nhập quản trị viên thành công!'
      };
    } else {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác! (Demo: admin / admin123)');
    }
  }
};

export const fetchOrders = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/orders`,
    {},
    () => localOrders
  );
};

export const updateOrderStatus = async (orderId, status) => {
  return fetchOrFallback(
    `${API_BASE_URL}/orders/${orderId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    },
    () => {
      const order = localOrders.find(o => o.id === Number(orderId));
      if (order) order.status = status;
      return { message: `Order #${orderId} status updated` };
    }
  );
};

export const createProduct = async (productData) => {
  return fetchOrFallback(
    `${API_BASE_URL}/products`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    },
    () => {
      const newProd = {
        id: Date.now(),
        ...productData,
        rating: 5.0,
        comments: []
      };
      localProducts.unshift(newProd);
      return { id: newProd.id, message: 'Product created' };
    }
  );
};

export const deleteProduct = async (productId) => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/${productId}`,
    { method: 'DELETE' },
    () => {
      localProducts = localProducts.filter(p => p.id !== Number(productId));
      return { message: 'Product deleted' };
    }
  );
};

export const sendContactMessage = async (contactData) => {
  return fetchOrFallback(
    `${API_BASE_URL}/contact`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    },
    () => {
      const msg = { id: Date.now(), ...contactData, created_at: new Date().toISOString() };
      localMessages.unshift(msg);
      return { message: 'Gửi liên hệ thành công!' };
    }
  );
};

export const fetchContactMessages = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/contact`,
    {},
    () => localMessages
  );
};
