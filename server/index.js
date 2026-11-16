const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const { processAiSearch } = require("./utils/aiSearch.js");
// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'luxe_fashion_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// File Path for Data

const productsFilePath = path.join(__dirname, 'data', 'products.json');



// --- Helper Functions ---
const readProducts = () => {
  if (!fs.existsSync(productsFilePath)) return [];
  try {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
};

const writeProducts = async (data) => {
  await fs.promises.writeFile(
    productsFilePath,
    JSON.stringify(data, null, 4)
  );
};

// --- ROUTES ---

app.get('/', (req, res) => {
  res.send('API is running (File-Based Storage with Cloudinary).');
});

// UPLOAD Image Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Cloudinary returns the path in req.file.path
  res.json({
    url: req.file.path,
    message: 'Image uploaded successfully'
  });
});

// GET All Products
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET Single Product
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id == req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST Create Product
app.post('/api/products', async (req, res) => {
  try {
    const products = readProducts();

    // ✅ ADD VALIDATION HERE (TOP)
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    // (optional but better)
    const price = Number(req.body.price);
    if (isNaN(price)) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const newProduct = {
  name: req.body.name,
  price: price,
  category: req.body.category || "clothing",
  gender: req.body.gender || "unisex",
  productType: req.body.productType || "unknown",
  image: req.body.image || "",
  id: Date.now(),
  createdAt: new Date().toISOString()
};

    products.push(newProduct);

    await writeProducts(products);

    res.status(201).json(newProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
});
  



app.post("/api/product/search", async (req, res) => {
  try {
    //  GET BOTH VALUES
    const {  query, sortBy } = req.body;

  if (!query) {
  return res.status(400).json({ message: "Query required" });
}
    console.log("🔍 Query:", query);
const allowedSort = ["price_low", "price_high"];
const safeSort = allowedSort.includes(sortBy) ? sortBy : "price_low";
    // AI search
    const result = await processAiSearch(
    query,
  process.env.GEMINI_API_KEY,
  safeSort
);

    let products = result.products || [];
    
  

res.json({
  message: result.message,
  filters: result.filters,
  count: products.length,
  products
});

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search error" });
  }
});


// PUT Update Product

app.put('/api/products/:id', async (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id == req.params.id);

    if (index !== -1) {

      if (req.body.price !== undefined && isNaN(Number(req.body.price))) {
  return res.status(400).json({ message: "Invalid price" });
}

      // ✅ CORRECT UPDATE
      const updatedProduct = {
        ...products[index],
        name: req.body.name?.trim() || products[index].name,
      price: req.body.price !== undefined
          ? Number(req.body.price)
          : products[index].price,
        category: req.body.category ?? products[index].category,
        gender: req.body.gender ?? products[index].gender,
        productType: req.body.productType ?? products[index].productType,
        image: req.body.image ?? products[index].image
      };

      // ✅ APPLY UPDATE
      products[index] = updatedProduct;

      await writeProducts(products);

      // ✅ CORRECT RESPONSE
      res.json(updatedProduct);

    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// DELETE Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    let products = readProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id != req.params.id);

    if (products.length < initialLength) {

      await writeProducts(products); 

      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  