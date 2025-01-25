const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductByFirm) ;

router.get('/uploads/"imageName' , (req , res) => {
    const imagenName = req.params.imagenName ;

    req.headersSent('Content-Type' , 'image/jpeg') ;

    res.sendFile(path.join(__dirname , '..' , 'uploads' , imagenName)) ;
});

router.delete('/:productId' , productController.deleteProductById) ;


module.exports = router;