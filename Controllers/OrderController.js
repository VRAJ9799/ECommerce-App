require("dotenv").config();
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ErroHandler = require("../Middleware/ErrorHandler");
const Carts = require("../Models/Carts");
const Orders = require("../Models/Orders");

class OrderController {
  async getAllOrders(req, res, next) {
    try {
      let query = {};
      let isNext = false;
      let limit = Number(req.query.limit || 10);
      let page = Number(req.query.page || 1);
      let skip = limit * (page - 1);
      const orders = await Orders.find(query)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit)
        .populate("User", "Email");
      const totalCount = await Orders.countDocuments(query);
      if (totalCount > limit * page) {
        isNext = true;
      }
      return res
        .status(200)
        .json({ success: true, isNext, totalCount, orders });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getAllUserOrders(req, res, next) {
    try {
      let query = {
        User: req.user._id,
      };
      let sortQuery = {
        createdAt: "desc",
      };
      let isNext = false;
      let limit = Number(req.query.limit || 10);
      let page = Number(req.query.page || 1);
      let skip = limit * (page - 1);
      const orders = await Orders.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);
      const totalCount = await Orders.countDocuments(query);
      if (totalCount > limit * page) {
        isNext = true;
      }
      return res
        .status(200)
        .json({ success: true, isNext, totalCount, orders });
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const { orderId } = req.params;
      if (!mongoose.isValidObjectId(orderId))
        throw new ErrorHandler(422, "Invalid Order Id");
      const order = await Orders.findById(orderId).populate(
        "OrderItems.ProductId",
        { _id: 1, Title: 1, Price: 1, Author: 1, Image: 1, Rating: 1 }
      );
      return res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  }

  async placeNewOrder(req, res, next) {
    try {
      const { Amount, ShippingDetails, Payment_Id, PaymentMethod } = req.body;
      const { line1, line2, city, state, country, postal_code, phone, email } =
        ShippingDetails;
      const CartItems = await Carts.find({ User: req.user._id })
        .select("+ProductId QuantityPurchased")
        .populate("ProductId", "Title Price");
      if (CartItems.length === 0)
        throw new ErrorHandler(422, "No Items in Cart");
      const OrderItems = CartItems.map((item) => {
        return {
          ProductId: item.ProductId._id,
          ProductName: item.ProductId.Title,
          Quantity: item.QuantityPurchased,
          Price: item.QuantityPurchased * item.ProductId.Price,
        };
      });
      let ShippingDetailsSchema = {
        line1,
        line2,
        city,
        country,
        postal_code,
        state,
      };
      console.log(ShippingDetailsSchema);
      const order = new Orders({
        OrderItems,
        TotalPrice: Amount,
        ShippingDetails: ShippingDetailsSchema,
        PhoneNumber: phone,
        User: req.user._id,
      });
      // const order = await Orders.create({
      //     OrderItems,
      //     TotalPrice: Amount,
      //     ShippingDetails: ShippingDetailsSchema,
      //     PhoneNumber: phone,
      //     User: req.user._id,
      // });
      //Payment
      if (PaymentMethod === "COD") {
        order.Payment = {
          PaymentStatus: "cash on delivery",
        };
        await order.save();
        await Carts.deleteMany({ User: req.user._id });
        return res.status(200).json({
          success: true,
          message: "Order Book Successful",
        });
      }
      let payment_response = await stripe.paymentIntents.create({
        payment_method: Payment_Id,
        amount: Amount,
        currency: "inr",
        description: `Order Of E-Commerce App confirmed `,
        receipt_email: email,
        metadata: { CustomerId: `${req.user._id}` },
      });
      const { id, status } = payment_response;
      order.Payment = {
        PaymentId: id,
        PaymentMethod: "Card",
        PaymentStatus: status,
      };
      await order.save();
      if (status === "succeeded")
        await Carts.deleteMany({ User: req.user._id });
      else if (status === "requires_confirmation")
        payment_response = await stripe.paymentIntents.confirm(
          payment_response.id
        );
      else if (status === "requires_action")
        return res.status(200).json({
          message: "Complete Payment",
          status: payment_response.status,
          next_action: payment_response.next_action,
        });
      return res.status(200).json({
        success: true,
        message: "Order Book Successful",
        status: payment_response.status,
        next_action: payment_response.next_action,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async updatePaymentStatus(req, res, next) {
    try {
      const event = req.body;
      console.log(event);
      if (
        event.type === "payment_intent.succeeded" ||
        event.type === "payment_intent.canceled" ||
        event.type === "payment_intent.payment_failed"
      ) {
        const { status } = event;
        const orderId = event.metadata.OrderId;
        const order = await Orders.findById(orderId);
        order.Payment = {
          PaymentStatus: status,
        };
        order.IsPaid = status === "succeeded" ? true : false;
        await order.save();
        return res.status(200).json({ received: true });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async payment(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await Orders.findById(orderId);
      if (!order) {
        throw new ErrorHandler(422, "Invalid Order Id");
      }
      order.Payment = {
        PaymentMethod: "COD",
        PaymentStatus: "succeeded",
      };
      order.IsPaid = true;
      await order.save();
      return res
        .status(200)
        .json({ success: true, message: "Payment Completed" });
    } catch (error) {
      next(error);
    }
  }

  async deliver(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await Orders.findById(orderId);
      if (!order) {
        throw new ErrorHandler(422, "Invalid Order Id");
      }
      order.IsDelivered = true;
      order.DeliveredOn = new Date();
      await order.save();
      return res.status(200).json({ success: true, message: "Delivered" });
    } catch (error) {
      next(error);
    }
  }
}

const orderController = new OrderController();
module.exports = orderController;
