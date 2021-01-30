const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title:{
        type: String,
        required: true
      },
    description:{
        type: String,
        required: true
      },
    features: [{
        title: String,
        desc:String
      }],
    images:[{
            url:String
        }
    ],
    categories:[{
        cateId:String
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
