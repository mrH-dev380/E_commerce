const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var preOrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
        detailProductId: String,
      },
    ],
    shipping: Number,
    cartTotal: Number,
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

//Export the model
module.exports = mongoose.model('PreOrder', preOrderSchema)
