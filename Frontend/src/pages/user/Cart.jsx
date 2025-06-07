/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useClearCartMutation,
  useGetCartProductQuery,
  useRemoveProductMutation,
  useUpdateCartMutation,
} from "@/features/api's/cartApi";
import { Loader, Loader2, MinusCircle, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

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

  const handleRedirect = ()=>{
    navigate('/checkout')
  }

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

      {/* Cart Table */}
      {cart?.length > 0 ? (
        <Table>
          <TableCaption>All the list of your products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((cartItem) => (
              <TableRow key={cartItem._id}>
                <TableCell>
                  <img
                    src={cartItem.product.image.url}
                    alt={cartItem.product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{cartItem.product.name}</TableCell>
                <TableCell>
                  ₹{cartItem?.product?.price * cartItem.product.quantity}
                </TableCell>
                <TableCell>{cartItem.quantity}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() =>
                        handleIncrement(cartItem.product._id, cartItem.quantity)
                      }
                    >
                      <PlusCircle />
                    </Button>
                    <Button
                      onClick={() =>
                        handleDecrement(cartItem.product._id, cartItem.quantity)
                      }
                    >
                      <MinusCircle />
                    </Button>
                    <Button
                      onClick={() => handleRemove(cartItem.product._id)}
                      className="bg-red-500 text-white"
                    >
                      {removeProductIsLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Remove"
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        // Empty Cart Message
        <p className="text-center text-gray-600 text-lg mt-10">
          Your cart is empty. Add some products to see them here.
        </p>
      )}
      <div>
        <Button onClick={handleRedirect}>Checkout</Button>
      </div>
    </div>
  );
};

export default Cart;
