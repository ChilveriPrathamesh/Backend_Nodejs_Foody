//Here in this file we write the logic for the models folder to create the table in the Database 

const Vendor = require('../models/Vender') ;
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv') ;
const bcrypt = require('bcryptjs') ;


dotEnv.config() ;

const secretKey = process.env.WhatIsYourName 

const vendorRegister = async(req , res) => {
    const {username , email , password} = req.body ;
    try {
        const vendorEmail = await Vendor.findOne({email}) ;
        if(vendorEmail) {
            return res.status(400).json("Email already exists")
        }

        //It bcrypt the hashed password to the Database 
        const hashedPassowrd = await bcrypt.hash(password , 10) ;
        //Helps to Insert the newVendor in the Database
        const newVendor = new Vendor({
            username , 
            email, 
            password : hashedPassowrd
        }) ;
        
        //Save the above newVendor in the Database 
        await newVendor.save();

        res.status(201).json({message:"Vendor registered Successfully"});
        console.log('registered') ;
    } catch(error) {
        console.log(error);
        res.status(500).json({error : "Internal Server Error"}) ;
        
    }
} 

const vendorLogin = async(req , res) => {
    const {email , password} = req.body;
    try {
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password , vendor.password))) {
            return res.status(401).json({error : "Invalid UserName or Password"}) ;
        }
        const token = jwt.sign({vendorId : vendor._id} , secretKey , {expiresIn : "1h"}) ;
        //token is used to find the individual of vendor that the all components should add to respective vendors 
        

        res.status(200).json({success : "Login Successfully" , token } ) ;
        console.log(email , "this is token " , token) ;
    } catch(error) {
        console.log(error) ;
        res.status(500).json({error : "Internal Server Error"}) ;
    }
}

//Creating the all vendors function to get the details of individual vendors 

const getAllVendors = async(req , res) => {
    try{    
        //Here populate keyword is used to find the Vendor iin the table by passing the table name as argument 
        const vendors = await Vendor.find().populate('firm') ; 
        res.json({vendors})
    } catch(error) {
        console.log(error) ;
        res.status(500).json({error : "Internal Server Error"}) ;
    }
}

//To fetch the individual records 
const getVendorById = async(req , res) => {
    const vendorId = req.params.apple ;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm') ;
        if(!vendor) {
            return res.status(404).json({error : "Vendor Not Found"} ) ; 
        }
        res.status(200).json({vendor}) ;
    } catch(error) {
        console.log(error) ;
        res.status(500).json({error : "Internal Server Error"}) ;
    }
}

module.exports = {vendorRegister , vendorLogin , getAllVendors , getVendorById} ;