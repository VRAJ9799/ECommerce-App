const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  ProductId: {
    type: mongoose.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  Price: {
    type: Number,
    required: true,
  },
  _id: false,
});

const ShippingDetailSchema = new mongoose.Schema({
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
});

const PaymentSchema = new mongoose.Schema(
  {
    PaymentId: {
      type: String,
    },
    PaymentMethod: {
      type: String,
      default: "COD",
    },
    PaymentStatus: {
      type: String,
    },
    _id: false,
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    OrderItems: [OrderItemSchema],
    OrderedOn: {
      type: Date,
      default: new Date(),
    },
    Payment: PaymentSchema,
    TotalPrice: {
      type: Number,
      required: true,
    },
    ShippingDetails: ShippingDetailSchema,
    PhoneNumber: {
      type: String,
      required: true,
    },
    User: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    IsPaid: {
      type: Boolean,
      default: false,
    },
    IsDelivered: {
      type: Boolean,
      default: false,
    },
    IsCancelled: {
      type: Boolean,
      default: false,
    },
    DeliveredOn: {
      type: Date,
    },
    Invoice: {
      type: String,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders;
