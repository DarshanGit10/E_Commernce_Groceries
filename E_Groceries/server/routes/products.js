const express = require("express");
const router = express.Router();
const Products = require('../models/Products')


// Route 1, GET method all products
router.get('/get_product', async(req, res) =>{
    try {
        const products = await Products.find({})
        res.status(200).json({success: true, countTotal: products.length, products})
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
})

// Route 2, GET method only one product
router.get('/get_product/:slug', async(req, res) =>{
    try {
        const product = await Products.findOne({slug: req.params.slug})
        if(!product){
            return res.status(404).json({success: false, message: "Product not found"})
        }
        res.status(200).json({success: true, product})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



module.exports = router;