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
    let{image, name, price, discount} = req.body;
    let product=await productmodel.create({image:image, name:name, price:price, discount:discount})
    res.redirect("/product")
});

module.exports = router;
    