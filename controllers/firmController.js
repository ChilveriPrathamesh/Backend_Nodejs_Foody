

const Firm = require('../models/Firm') ;
const Vendor = require('../models/Vender') ;
const multer  = require('multer') ;

const storage = multer.diskStorage({
    destination : function (req , file , cb) {
        cb(null , 'uploads/') // Destination folder where the uploaded images will be stored 
    } , 
    filename : function (req , file , cb) {
        //Helps to save the image with the path
        cb(null , Date.now() + '-' + path.extname(file.originalname)) ; //Generating a unique filename 
    }
}) ;

const upload = multer({storage : storage}) ;


const addFirm = async(req , res) => {
    try{
        const {firmname , area , category , region , offer} = req.body ; 

        //Add the images 
        const image = req.file? req.file.filename : undefined ;

        const vendor = await Vendor.findById(req.vendorId) ;

        if(!vendor) {
            res.status(404).json({message : "Vendor Not Found"}) ;
        }

        const firm = new Firm({
            firmname , area ,category , region , offer , image , vendor : vendor._id 
        })

        //To save the firm instances 
       const savedFirm = await firm.save() ;
       vendor.firm.push(savedFirm);
       await vendor.save();

        return res.status(200).json({message : 'Firm Added successfully'})
        
    } catch(error) {
        console.error(error) ;
        res.status(500).json("Internal Server Error");
    }
}

const deleteFirmById = async(req , res) => {
    try {
        const firmId = req.params.firmId ;

        const deleteProduct = await Product.findByIdAndDelet(firmId) ;

        if (!deleteProduct) {
            return res.status(404).json({error : "No Product Found"}) ;
        }
    } catch(error) {
        console.error( error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//Image is present but we need to use the curlybraces with the array upload.single for the singel image 
module.exports = {addFirm : [upload.single('image') , addFirm] , deleteFirmById } ;