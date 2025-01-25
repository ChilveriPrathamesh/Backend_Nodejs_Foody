
const express = require('express') ;
const firmController = require('../controllers/firmController') ;
const verifyToken = require('../middleware/verifyToken') ;


const router = express.Router();

router.post('/add-firm' , verifyToken , firmController.addFirm) ;

router.get('/uploads/"imageName' , (req , res) => {
    const imagenName = req.params.imagenName ;

    req.headersSent('Content-Type' , 'image/jpeg') ;

    res.sendFile(path.join(__dirname , '..' , 'uploads' , imagenName)) ;
});


router.delete('/:firmId' , firmController.deleteFirmById) ;


module.exports = router ; 