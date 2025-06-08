/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  useClearCartMutation,
  useGetCartProductQuery,
  useRemoveProductMutation,
  useUpdateCartMutation,
} from "@/features/api's/cartApi";
import { Loader, Loader2, MinusCircle, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { data, isLoading, isError, error } = useGetCartProductQuery();
  const [
    removeProduct,
    {
      data: removeProductData,
      isSuccess: removeProductIsSuccess,
      isLoading: removeProductIsLoading,
      isError: removeProductIsError,
      error: removeProductError,
    },
  ] = useRemoveProductMutation();

  const [
    clearCart,
    {
      data: clearCartData,
      isSuccess: clearCartIsSuccess,
      isLoading: clearCartIsLoading,
      isError: clearCartIsError,
      error: clearCartError,
    },
  ] = useClearCartMutation();

  const [
    updateCart,
    {
      data: updateCartData,
      isError: updateIsError,
      error: updateError,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdateCartMutation();

  useEffect(() => {
    if (removeProductData && removeProductIsSuccess) {
      toast.success(
        removeProductData?.message || "Product removed successfully !"
      );
    }
    if (removeProductIsError && removeProductError) {
      toast.error(removeProductError?.data?.message || "Internal server error");
    }
    if (clearCartData && clearCartIsSuccess) {
      toast.success(clearCartData?.message || "Cart Cleared");
    }
    if (clearCartError && clearCartIsError) {
      toast.error(clearCartError?.data?.message || "Internal server error");
    }
    if (updateCartData && updateIsSuccess) {
      toast.success(
        updateCartData?.message || "Product updated successfully !"
      );
    }
    if (updateIsError && updateError) {
      toast.error(updateError?.data?.message || "Internal server error");
    }
  }, [
    removeProductError,
    removeProductIsError,
    removeProductIsSuccess,
    clearCartError,
    clearCartIsError,
    clearCartIsSuccess,
    updateIsError,
    updateError,
    updateIsSuccess,
  ]);

  const navigate = useNavigate();

  // Extract cart products from the data
  const cart = data?.products?.[0]?.products || [];

  const handleRedirect = () => {
    navigate("/checkout");
  };

  const handleIncrement = (productId, quantity) => {
    updateCart({ pid: productId, quantity: quantity + 1 });
  };

  const handleDecrement = (productId, quantity) => {
    updateCart({ pid: productId, quantity: quantity - 1 });
  };

  const handleRemove = (pid) => {
    removeProduct(pid);
  };

  const handleClearCart = () => {
    clearCart();
  };

  // for fetching cart data
  if (isLoading) return <Loader />;
  if (isError && error) return <p>{error.data.message}</p>;

  return (
    <div className="max-w-7xl mx-auto p-5">
      {/* Clear Cart Button */}
      <div className="flex justify-end mb-5">
        <Button onClick={handleClearCart} className="bg-red-500 text-white">
          {clearCartIsLoading ? (
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            "  Clear Cart"
          )}
        </Button>
      </div>

      {cart?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((cartItem) => (
            <div
              key={cartItem._id}
              className="border rounded-xl p-4 shadow-md flex flex-col justify-between"
            >
              <Link to={`/product/${cartItem?.product._id}`}>
                <img
                  src={cartItem.product.image.url}
                  alt={cartItem.product.name}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
              </Link>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {cartItem.product.name}
                </h2>
                <p className="text-gray-600">
                  ₹{cartItem?.product?.price * cartItem.quantity}
                </p>
                <div className="flex items-center gap-2 my-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleDecrement(cartItem.product._id, cartItem.quantity)
                    }
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                  <span className="text-lg">{cartItem.quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleIncrement(cartItem.product._id, cartItem.quantity)
                    }
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => handleRemove(cartItem.product._id)}
                className="bg-red-500 text-white mt-2"
              >
                {removeProductIsLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Remove"
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          Your cart is empty. Add some products to see them here.
        </p>
      )}

      {cart?.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleRedirect} className="px-6 py-2 text-lg">
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
