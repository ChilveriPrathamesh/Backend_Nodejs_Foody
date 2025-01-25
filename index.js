const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');

const cors = require('cors') ;
const path = require('path');


const app = express();

const PORT = process.env.PORT || 4000;

dotEnv.config();
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected Successfully!"))
    .catch((error) => console.log("MongoDB Connection Error:", error));

app.use(bodyParser.json());

// Routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads' , express.static('uploads')) ; 

// Test Route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Restaurant</h1>");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started and running at http://localhost:${PORT}`);
});
