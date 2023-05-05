const express = require("express");
const router = express.Router();
const Products = require('../models/Products')

  


// Route 1, GET method all products
router.get('/get_product', async (req, res) => {
    try {
        // Validate request parameters if any

        const products = await Products.find({})

        // Send a 404 Not Found response if no products are found
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found' })
        }

        res.status(200).json({ success: true, countTotal: products.length, products })
    } catch (error) {
        console.error(error.message)

        // Handle different types of errors separately
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message })
        }

        res.status(500).send('Internal Server Error')
    }
})


// Route 2, GET method only one product
router.get('/get_product/:slug', async (req, res) => {
    try {
        // Validate request parameters
        if (!req.params.slug || req.params.slug.trim() === '') {
            return res.status(400).json({ success: false, message: 'Invalid slug' })
        }

        const product = await Products.findOne({ slug: req.params.slug })

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        // Only return necessary information
        res.status(200).json({ success: true, product })
    } catch (error) {
        console.error(error.message)

        // Handle different types of errors separately
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message })
        }

        res.status(500).send('Internal Server Error')
    }
})


// Route 3
router.get('/search/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        
        // Validate the keyword parameter
        if (!keyword || !/^[a-zA-Z0-9]+$/.test(keyword)) {
            return res.status(400).json({ success: false, message: 'Invalid keyword' });
        }
        
        // Query the database for matching products
        const matchingProducts = await Products.find({
            $or:[
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        });
        

        
        res.status(200).json({ success: true, matchingProducts });
    } catch (error) {
        console.error(error.message);
        
        // Handle different types of errors separately
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }      
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;