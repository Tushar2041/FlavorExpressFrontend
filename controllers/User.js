import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";
import mongoose from "mongoose";
import Food from "../models/Food.js";


dotenv.config();

// Auth

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    console.log(req.body)
    //Check for existing user
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Check for existing user
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return next(createError(409, "User not found."));
    }

    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

//Cart

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const existingCartItemIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1); // Remove the product from the cart
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in the user's cart"));
    }
  } catch (err) {
    next(err);
  }
};

export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Food",
    });
    const cartItems = user.cart;
    return res.status(200).json(cartItems);
  } catch (err) {
    next(err);
  }
};

//Orders

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });

    await order.save();
    user.cart = [];
    await user.save();
    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }
    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};
// export const getMyOrders = async (req,res,next) => {
//   const userID = req.user;
//   const ordersResponse = await Orders.find({
//     user:new mongoose.Types.ObjectId(userID) 
//   })
//   // console.log(ordersResponse)
  
//   const temp =await  ordersResponse?.forEach(async (element)=>{
//     const x = element.products;
//     let productDetails = [];
//     const a =await  x.forEach(async (t)=>{
//       const productId = t.product;
//       const quantity = t.quantity;
//       const temp = {};
//       // console.log(productId)
//       const s  = await Food.find({_id:productId});
//       // console.log(s)
//       temp.quantity = quantity;
//       temp.productDetails = s;
//       // console.log(temp)
     
//       return s
//     })
//     console.log(a)
//     element.finalProducts = productDetails;
//   })

//   return res.status(200).json({
//     message:"Yes its working",
//     ordersResponse
//   })
// }

export const getMyOrders = async (req, res, next) => {
  try {
    const userID = req.user;

    const ordersResponse = await Orders.find({
      user: new mongoose.Types.ObjectId(userID)
    });

    // Use map to create a new array of promises
    const enrichedOrders = await Promise.all(
      ordersResponse.map(async (order) => {
        const products = order.products;
        
        // Use map to create an array of product details promises
        const productDetailsPromises = products.map(async (product) => {
          const productId = product.product;
          const quantity = product.quantity;

          const productDetail = await Food.findById(productId); // Use findById for a single document

          return {
            quantity,
            // productDetails: productDetail,
            productName:productDetail.name
          };
        });

        // Wait for all product details to resolve
        const productDetails = await Promise.all(productDetailsPromises);

        // Assign finalProducts to order
        return {
          ...order._doc, // Spread order to include all other fields
          finalProducts: productDetails
        };
      })
    );

    console.log(enrichedOrders); // Log enriched orders for debugging
    return res.status(200).json({
      message: "Yes, it's working",
      orders: enrichedOrders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

//Favorites

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const favoriteProducts = user.favourites;
    return res.status(200).json(favoriteProducts);
  } catch (err) {
    next(err);
  }
};
