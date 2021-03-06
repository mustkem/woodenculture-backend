const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cors =  require('cors');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const authCommon = require('./routes/common');

const adminRoutes = require('./admin/routes/product');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 25) 
);  

// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); 
 

app.use('/images', express.static(path.join(__dirname, 'images')));



// app.use(cors());


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/common', authCommon);


app.use('/admin', adminRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(error)  
  res.status(status).json({ message: message, data: data });
});

//mongodb+srv://ship:ship12345@cluster0-r3cso.mongodb.net/woodenculture-db?retryWrites=true&w=majority
//

//mongodb+srv://ship:<password>@cluster0.r3cso.mongodb.net/<dbname>?retryWrites=true&w=majority
const port  = process.env.PORT || 8080;
mongoose
  .connect(
    'mongodb+srv://ship:ship12345@cluster0-r3cso.mongodb.net/woodenculture-db?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(result => {
    app.listen(port, ()=>{
      console.log("**********Running on***********", port)
    });
    return result;
  })
  .catch(err => console.log("********Error in connection********",err));
