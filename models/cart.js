module.exports = function Cart(Cart) {
  this.items = Cart.items || {};
  this.totalQty = Cart.totalQty || 0;
  this.totalPrice = Cart.totalPrice || 0;

  this.add = function (item, id) {
    const storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 }
    }
    storedItem.qty++
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.price
  }
  this.generateArray = function () {
    const arr = [];
    for (const id in this.items) {
      arr.push(this.items[id])
    }
    return arr;
  }
} 