const express = require('express');
const multer=require("multer")
const router = express.Router();
const productmodel = require("../models/product-model")
const storage = multer.memoryStorage()
const upload=multer({storage:storage})
// Get all products
router.get('/', (req, res) => {
    res.render("owner")
});

router.post("/add",upload.single("image"), async(req, res) => {
    try {
        let { name, price, discount } = req.body;
        let image = req.file ? req.file.buffer : null; // Get the actual file buffer
        
        let product = await productmodel.create({
            image: image, 
            name: name, 
            price: price, 
            discount: discount
        });
        
        res.redirect("/product");
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send("Error creating product");
    }
});

// Route to serve product images
router.get("/image/:id", async (req, res) => {
    try {
        const product = await productmodel.findById(req.params.id);
        if (!product || !product.image) {
            return res.status(404).send("Image not found");
        }
        
        res.set('Content-Type', 'image/jpeg'); // You can make this dynamic based on file type
        res.send(product.image);
    } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).send("Error serving image");
    }
});

module.exports = router;
