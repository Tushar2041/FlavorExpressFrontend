import mongoose from "mongoose";
import Food from "../models/Food.js";
import axios from "axios";

export const addProducts = async (req, res, next) => {
  try {
    const foodData = req.body;
    if (!Array.isArray(foodData)) {
      return next(
        createError(400, "Invalid request. Expected an array of foods.")
      );
    }
    let createdfoods = [];
    for (const foodInfo of foodData) {
      const { name, desc, img, price, ingredients, category } = foodInfo;
      const product = new Food({
        name,
        desc,
        img,
        price,
        ingredients,
        category,
      });
      const createdFoods = await product.save();
      createdfoods.push(createdFoods);
    }
    return res
      .status(201)
      .json({ message: "Products added successfully", createdfoods });
  } catch (err) {
    next(err);
  }
};

export const getFoodItems = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, ingredients, search } = req.query;
    ingredients = ingredients?.split(",");
    categories = categories?.split(",");

    const filter = {};
    if (categories && Array.isArray(categories)) {
      filter.category = { $in: categories }; // Match products in any of the specified categories
    }
    if (ingredients && Array.isArray(ingredients)) {
      filter.ingredients = { $in: ingredients }; // Match products in any of the specified ingredients
    }
    if (maxPrice || minPrice) {
      filter["price.org"] = {};
      if (minPrice) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice);
      }
    }
    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } }, // Case-insensitive title search
        { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
      ];
    }
    const foodList = await Food.find(filter);

    return res.status(200).json(foodList);
  } catch (err) {
    next(err);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const food = await Food.findById(id);
    if (!food) {
      return next(createError(404, "Food not found"));
    }
    return res.status(200).json(food);
  } catch (err) {
    next(err);
  }

}
export const insertData = async(req,res)=>{
  const arr = [
    {
        "_id": "65f082acfea87c0a224ce7a1",
        "name": "Classic Chicken Cheese Burger",
        "desc": "A mouthwatering classic cheeseburger with a juicy chicken patty, melted cheese, fresh lettuce, tomatoes, onions, and our special sauce.",
        "img": "https://img.freepik.com/premium-photo/delicious-crispy-chicken-burger-ai_742252-5712.jpg",
        "price": {
            "org": 120,
            "mrp": 220,
            "off": 55,
            "_id": "65f082acfea87c0a224ce7a2"
        },
        "category": [
            "Burger",
            "Non Veg",
            "Chicken",
            "Patty"
        ],
        "ingredients": [
            "Chicken patty",
            "Cheese",
            "Lettuce",
            "Tomatoes",
            "Onions",
            "Special sauce",
            "Burger bun"
        ],
        "createdAt": "2024-03-12T16:28:28.849Z",
        "updatedAt": "2024-03-12T16:28:28.849Z",
        "__v": 0
    },
    {
        "_id": "65f084a442108ea0fac833b4",
        "name": "Veggie Delight Pizza",
        "desc": "A delightful vegetarian pizza loaded with fresh vegetables, cheese, and our signature tomato sauce.",
        "img": "https://media-cdn.tripadvisor.com/media/photo-m/1280/1a/41/a7/43/popo-s-veggie-delight.jpg",
        "price": {
            "org": 150,
            "mrp": 250,
            "off": 40,
            "_id": "65f084a442108ea0fac833b5"
        },
        "category": [
            "Pizza",
            "Vegetarian",
            "Italian"
        ],
        "ingredients": [
            "Cheese",
            "Tomatoes",
            "Bell peppers",
            "Mushrooms",
            "Onions",
            "Olives",
            "Pizza dough",
            "Tomato sauce"
        ],
        "createdAt": "2024-03-12T16:36:52.367Z",
        "updatedAt": "2024-03-12T16:36:52.367Z",
        "__v": 0
    },
    {
        "_id": "65f084d546a1e53f9b30dff2",
        "name": "Grilled Salmon Steak",
        "desc": "A succulent grilled salmon steak seasoned to perfection, served with a side of roasted vegetables.",
        "img": "https://houseofnasheats.com/wp-content/uploads/2021/10/How-to-Cook-Salmon-Steaks-Square-1.jpg",
        "price": {
            "org": 180,
            "mrp": 280,
            "off": 35,
            "_id": "65f084d546a1e53f9b30dff3"
        },
        "category": [
            "Seafood",
            "Grilled",
            "Salmon"
        ],
        "ingredients": [
            "Salmon steak",
            "Lemon",
            "Olive oil",
            "Salt",
            "Black pepper",
            "Mixed vegetables"
        ],
        "createdAt": "2024-03-12T16:37:41.793Z",
        "updatedAt": "2024-03-12T16:37:41.793Z",
        "__v": 0
    },
    {
        "_id": "65f084d546a1e53f9b30dff6",
        "name": "Chocolate Brownie Sundae",
        "desc": "A decadent chocolate brownie topped with vanilla ice cream, chocolate sauce, and whipped cream.",
        "img": "https://recipes.net/wp-content/uploads/2023/05/liams-brownie-sundae_19db08639783daa2a1f2774a647e28cc.jpeg",
        "price": {
            "org": 80,
            "mrp": 120,
            "off": 33,
            "_id": "65f084d546a1e53f9b30dff7"
        },
        "category": [
            "Dessert",
            "Chocolate",
            "Ice Cream"
        ],
        "ingredients": [
            "Chocolate brownie",
            "Vanilla ice cream",
            "Chocolate sauce",
            "Whipped cream",
            "Nuts"
        ],
        "createdAt": "2024-03-12T16:37:41.946Z",
        "updatedAt": "2024-03-12T16:37:41.946Z",
        "__v": 0
    },
    {
        "_id": "65f084d646a1e53f9b30dffa",
        "name": "Spicy Chicken Noodles",
        "desc": "Delicious and spicy chicken noodles with a mix of fresh vegetables and savory spices.",
        "img": "https://www.whiskaffair.com/wp-content/uploads/2018/03/Chicken-Hakka-Noodles-2-3.jpg",
        "price": {
            "org": 100,
            "mrp": 180,
            "off": 45,
            "_id": "65f084d646a1e53f9b30dffb"
        },
        "category": [
            "Noodles",
            "Spicy",
            "Chinese",
            "Chicken"
        ],
        "ingredients": [
            "Chicken",
            "Noodles",
            "Bell peppers",
            "Carrots",
            "Spring onions",
            "Soy sauce",
            "Chili sauce"
        ],
        "createdAt": "2024-03-12T16:37:42.103Z",
        "updatedAt": "2024-03-12T16:37:42.103Z",
        "__v": 0
    },
    {
        "_id": "65fa862a0eaeb76a41d7463b",
        "name": "Classic Beef Burger",
        "desc": "A classic beef burger with a juicy patty, melted cheese, fresh lettuce, tomatoes, onions, and our special sauce.",
        "img": "https://www.eatthis.com/wp-content/uploads/sites/4//media/images/ext/520765216/classic-beef-burger.jpg?quality=82&strip=1&w=800",
        "price": {
            "org": 120,
            "mrp": 200,
            "off": 40,
            "_id": "65fa862a0eaeb76a41d7463c"
        },
        "category": [
            "Burger",
            "Non Veg"
        ],
        "ingredients": [
            "Beef patty",
            "Cheese",
            "Lettuce",
            "Tomatoes",
            "Onions",
            "Special sauce",
            "Burger bun"
        ],
        "createdAt": "2024-03-20T06:46:02.760Z",
        "updatedAt": "2024-03-20T06:46:02.760Z",
        "__v": 0
    },
    {
        "_id": "65fa862a0eaeb76a41d7463f",
        "name": "Creamy Alfredo Pasta",
        "desc": "Delicious pasta cooked in creamy Alfredo sauce, garnished with Parmesan cheese and fresh parsley.",
        "img": "https://www.allrecipes.com/thmb/gTibTRJ8MW87L0jMhAvXPjIDD94=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/19402-quick-and-easy-alfredo-sauce-DDMFS-4x3-17abb2055c714807944172db9172b045.jpg",
        "price": {
            "org": 180,
            "mrp": 280,
            "off": 35,
            "_id": "65fa862a0eaeb76a41d74640"
        },
        "category": [
            "Pasta",
            "Italian"
        ],
        "ingredients": [
            "Pasta",
            "Cream",
            "Butter",
            "Parmesan cheese",
            "Garlic",
            "Parsley"
        ],
        "createdAt": "2024-03-20T06:46:02.915Z",
        "updatedAt": "2024-03-20T06:46:02.915Z",
        "__v": 0
    },
    {
        "_id": "65fa862a0eaeb76a41d74643",
        "name": "Grilled Chicken Sandwich",
        "desc": "A delicious sandwich filled with grilled chicken, lettuce, tomatoes, and mayonnaise, served on toasted bread.",
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkUKk_i-GHKmyPQFJUnNw0csz-hMvru4meAHOKBIbXjh6MoZkDX49U0Lb2_YVjmuWzXFc&usqp=CAU",
        "price": {
            "org": 100,
            "mrp": 150,
            "off": 33,
            "_id": "65fa862a0eaeb76a41d74644"
        },
        "category": [
            "Sandwich",
            "Non Veg"
        ],
        "ingredients": [
            "Grilled chicken",
            "Lettuce",
            "Tomatoes",
            "Mayonnaise",
            "Bread"
        ],
        "createdAt": "2024-03-20T06:46:02.997Z",
        "updatedAt": "2024-03-20T06:46:02.997Z",
        "__v": 0
    },
    {
        "_id": "65fa862b0eaeb76a41d74647",
        "name": "Greek Salad",
        "desc": "A refreshing salad with crisp lettuce, juicy tomatoes, cucumbers, olives, onions, and feta cheese, drizzled with olive oil and vinegar.",
        "img": "https://cdn.loveandlemons.com/wp-content/uploads/2019/07/greek-salad-2.jpg",
        "price": {
            "org": 90,
            "mrp": 120,
            "off": 25,
            "_id": "65fa862b0eaeb76a41d74648"
        },
        "category": [
            "Salad",
            "Vegetarian"
        ],
        "ingredients": [
            "Lettuce",
            "Tomatoes",
            "Cucumbers",
            "Olives",
            "Onions",
            "Feta cheese",
            "Olive oil",
            "Vinegar"
        ],
        "createdAt": "2024-03-20T06:46:03.124Z",
        "updatedAt": "2024-03-20T06:46:03.124Z",
        "__v": 0
    },
    {
        "_id": "65fa862b0eaeb76a41d7464b",
        "name": "Beef Tacos",
        "desc": "Delicious tacos filled with seasoned ground beef, lettuce, tomatoes, cheese, and salsa, served in crispy taco shells.",
        "img": "https://www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg",
        "price": {
            "org": 150,
            "mrp": 220,
            "off": 32,
            "_id": "65fa862b0eaeb76a41d7464c"
        },
        "category": [
            "Tacos",
            "Mexican"
        ],
        "ingredients": [
            "Beef",
            "Lettuce",
            "Tomatoes",
            "Cheese",
            "Salsa",
            "Taco shells"
        ],
        "createdAt": "2024-03-20T06:46:03.330Z",
        "updatedAt": "2024-03-20T06:46:03.330Z",
        "__v": 0
    },
    {
        "_id": "65fa862b0eaeb76a41d7464f",
        "name": "Margherita Pizza",
        "desc": "A classic Margherita pizza topped with fresh tomatoes, mozzarella cheese, basil leaves, and olive oil on a thin crust.",
        "img": "https://cdn.loveandlemons.com/wp-content/uploads/2023/07/margherita-pizza-500x375.jpg",
        "price": {
            "org": 200,
            "mrp": 280,
            "off": 28,
            "_id": "65fa862b0eaeb76a41d74650"
        },
        "category": [
            "Pizza",
            "Italian"
        ],
        "ingredients": [
            "Tomatoes",
            "Mozzarella cheese",
            "Basil leaves",
            "Olive oil",
            "Pizza dough",
            "Tomato sauce"
        ],
        "createdAt": "2024-03-20T06:46:03.575Z",
        "updatedAt": "2024-03-20T06:46:03.575Z",
        "__v": 0
    },
    {
        "_id": "65fa862b0eaeb76a41d74653",
        "name": "Vegetable Stir Fry",
        "desc": "A flavorful vegetable stir fry made with a variety of fresh vegetables, tofu, and stir fry sauce, served with steamed rice.",
        "img": "https://www.budgetbytes.com/wp-content/uploads/2022/03/Easy-Vegetable-Stir-Fry-V1.jpg",
        "price": {
            "org": 120,
            "mrp": 180,
            "off": 33,
            "_id": "65fa862b0eaeb76a41d74654"
        },
        "category": [
            "Stir Fry",
            "Vegetarian"
        ],
        "ingredients": [
            "Mixed vegetables",
            "Tofu",
            "Stir fry sauce",
            "Rice"
        ],
        "createdAt": "2024-03-20T06:46:03.698Z",
        "updatedAt": "2024-03-20T06:46:03.698Z",
        "__v": 0
    },
    {
        "_id": "65fa862b0eaeb76a41d74657",
        "name": "Fruit Smoothie",
        "desc": "A refreshing fruit smoothie made with a blend of fresh fruits, yogurt, and honey, perfect for a healthy breakfast or snack.",
        "img": "https://www.evolvingtable.com/wp-content/uploads/2022/12/How-to-Make-Smoothie-2.jpg",
        "price": {
            "org": 80,
            "mrp": 100,
            "off": 20,
            "_id": "65fa862b0eaeb76a41d74658"
        },
        "category": [
            "Smoothie",
            "Healthy"
        ],
        "ingredients": [
            "Mixed fruits",
            "Yogurt",
            "Honey"
        ],
        "createdAt": "2024-03-20T06:46:03.773Z",
        "updatedAt": "2024-03-20T06:46:03.773Z",
        "__v": 0
    },
    {
        "_id": "65fd98eb97c8bedc37fb0278",
        "name": "Chicken Curry",
        "desc": "A flavorful chicken curry made with tender chicken pieces, onions, tomatoes, and a blend of aromatic spices, served with rice or bread.",
        "img": "https://www.foodandwine.com/thmb/8YAIANQTZnGpVWj2XgY0dYH1V4I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/spicy-chicken-curry-FT-RECIPE0321-58f84fdf7b484e7f86894203eb7834e7.jpg",
        "price": {
            "org": 180,
            "mrp": 250,
            "off": 28,
            "_id": "65fd98eb97c8bedc37fb0279"
        },
        "category": [
            "Curry",
            "Non Veg"
        ],
        "ingredients": [
            "Chicken",
            "Onions",
            "Tomatoes",
            "Spices",
            "Rice"
        ],
        "createdAt": "2024-03-22T14:42:51.342Z",
        "updatedAt": "2024-03-22T14:42:51.342Z",
        "__v": 0
    },
    {
        "_id": "65fd98fc9dd49ee37916899f",
        "name": "Chicken Curry",
        "desc": "A flavorful chicken curry made with tender chicken pieces, onions, tomatoes, and a blend of aromatic spices, served with rice or bread.",
        "img": "https://www.foodandwine.com/thmb/8YAIANQTZnGpVWj2XgY0dYH1V4I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/spicy-chicken-curry-FT-RECIPE0321-58f84fdf7b484e7f86894203eb7834e7.jpg",
        "price": {
            "org": 180,
            "mrp": 250,
            "off": 28,
            "_id": "65fd98fc9dd49ee3791689a0"
        },
        "category": [
            "Curry",
            "Non Veg"
        ],
        "ingredients": [
            "Chicken",
            "Onions",
            "Tomatoes",
            "Spices",
            "Rice"
        ],
        "createdAt": "2024-03-22T14:43:08.211Z",
        "updatedAt": "2024-03-22T14:43:08.211Z",
        "__v": 0
    },
    {
        "_id": "65fd9e7ad502506c8669948d",
        "name": "Chicken Curry",
        "desc": "A flavorful chicken curry made with tender chicken pieces, onions, tomatoes, and a blend of aromatic spices, served with rice or bread.",
        "img": "https://www.foodandwine.com/thmb/8YAIANQTZnGpVWj2XgY0dYH1V4I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/spicy-chicken-curry-FT-RECIPE0321-58f84fdf7b484e7f86894203eb7834e7.jpg",
        "price": {
            "org": 180,
            "mrp": 250,
            "off": 28,
            "_id": "65fd9e7ad502506c8669948e"
        },
        "category": [
            "Curry",
            "Non Veg"
        ],
        "ingredients": [
            "Chicken",
            "Onions",
            "Tomatoes",
            "Spices",
            "Rice"
        ],
        "createdAt": "2024-03-22T15:06:34.155Z",
        "updatedAt": "2024-03-22T15:06:34.155Z",
        "__v": 0
    }
]
for (const foodInfo of arr) {
  const { name, desc, img, price, ingredients, category } = foodInfo;
  const product = new Food({
    name,
    desc,
    img,
    price,
    ingredients,
    category,
  });
  const createdFoods = await product.save();
  // createdfoods.push(createdFoods);
}
  return res.status(200).json({
    message:"Inserted Successfully"
  })
}
;
