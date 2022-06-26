const { Router } = require("express");
const User = require("../models/user");
const Product = require("../models/createprod");
const auth = require("../middleware/auth");
const router = Router();

function mapCartItems(cart) {
  console.log("cart id mappings: " , cart.items.itemId);

  return cart.items.map((p) => ({
    ...p.itemId._doc,
    id: p.itemId._id,
    count: p.count,
  }));
}

function computePrice(items) {
  return items.reduce((total, product) => {
    return (total += product.price * product.count);
  }, 0);
}

router.get("/", auth, async (req, res) => {
  const user = await req.user.populate("cart.items.itemId");

  console.log("user cart",user.cart);
  const products = mapCartItems(user.cart);
  res.json(products);

  // res.render('cart', {
  //   title: 'Cart',
  //   products: products,
  //   price: computePrice(products)
  // })
});

router.post("/", auth, async (req, res) => {
  console.log("cart req", req.user);
  const product = await Product.findById(req.body);
  await req.user.addToCart(product);
  res.redirect("/cart");
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.itemId");
  const products = mapCartItems(user.cart);
  const cart = {
    products,
    price: computePrice(products),
  };
  res.status(200).json(cart);
});

router.get("/clear", auth, async (req, res) => {
  await req.user.clearCart()
})

module.exports = router;
