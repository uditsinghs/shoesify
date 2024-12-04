export const calculateTotalPrice = (products) => {
  return products.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};
