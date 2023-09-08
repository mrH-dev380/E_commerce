const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model

const orderSchema = new mongoose.Schema(
  {
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shippingInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    shipping: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    coupon: {
      type: String,
    },
    discount: {
      type: Number,
    },
    totalPriceAfterDiscount: {
      type: Number,
    },
    orderStatus: {
      type: String,
      default: 'Ordered',
    },
  },
  { timestamps: true }
)

// var orderSchema = new mongoose.Schema(
//   {
//     products: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product',
//         },
//         count: Number,
//         color: String,
//       },
//     ],
//     paymentIntent: {},
//     orderStatus: {
//       type: String,
//       default: 'Not Processed',
//       enum: [
//         'Not Processed',
//         'Cash on Delivery',
//         'Processing',
//         'Dispatched',
//         'Cancelled',
//         'Delivered',
//       ],
//     },
//     orderby: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   },
//   {
//     timestamps: true,
//   }
// )

//Export the model
module.exports = mongoose.model('Order', orderSchema)
