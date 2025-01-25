const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp + extension
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        // Extract form data from request body
        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined; // Get uploaded image

        if (!productName || !price || !category) {
            return res.status(400).json({ error: "Product name, price, and category are required." });
        }

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No Firm Found" });
        }

        // Create a new product instance
        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id
        });

        // Save product to the database
        const savedProduct = await product.save(); 

        // Update firm's product list
       // if (!firm.products) firm.products = [];
        firm.products.push(savedProduct); 

        await firm.save(); // Save the firm with the new product

        return res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getProductByFirm = async(req , res) => {
    try {
        const  firmId = req.params.firmId ;
        const firm = await Firm.findById(firmId) ;

        if(!firm) {
            return res.status(404).json({error : "No Firm Found"}) ;
        }

        //To know the restaurent name 

        const restaurentName = firm.firmname ;
        
        const products = await Product.find({firm:firmId}) ;

        res.status(200).json({ restaurentName ,products})

    } catch(error) {
        console.error( error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteProductById = async(req , res) => {
    try {
        const productId = req.params.productId ;

        const deleteProduct = await Product.findByIdAndDelet(productId) ;

        if (!deleteProduct) {
            return res.status(404).json({error : "No Product Found"}) ;
        }
    } catch(error) {
        console.error( error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
 
module.exports = { addProduct: [upload.single('image'), addProduct] , getProductByFirm , deleteProductById };
