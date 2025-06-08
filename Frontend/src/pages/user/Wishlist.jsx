import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/features/api's/productApi";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/features/api's/cartApi";

const Wishlist = () => {
  const { data, isLoading, isError, error } = useGetWishlistQuery();
  const [
    removeFromWishlist,
    {
      data: removeData,
      isLoading: removeIsLoading,
      isError: removeIsError,
      error: removeError,
      isSuccess: removeIsSuccess,
    },
  ] = useRemoveFromWishlistMutation();
  const [
    addToCart,
    {
      data: addToCartData,
      isError: addToCartIsError,
      error: addToCartError,
      isLoading: addToCartIsLoading,
      isSuccess: addToCartIsSuccess,
    },
  ] = useAddToCartMutation();

  const { wishlist } = data || [];
  const handleAddToCart = (pid) => {
    addToCart(pid);
  };
  const handleRemoveFromWishlist = (pid) => {
    removeFromWishlist(pid);
  };

  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeData.message || "Removed from wishlist");
    }
    if (removeError && removeIsError) {
      toast.error(removeError.data.message || "Internal server error");
    }
  }, [ removeError, removeIsError, removeIsSuccess]);

  useEffect(() => {
    if (addToCartData && addToCartIsSuccess) {
      toast.success(addToCartData?.message || "Added to cart");
    }
    if (addToCartIsError && addToCartError) {
      toast.error(addToCartError?.data?.message || "Internal server error");
    }
  }, [addToCartData, addToCartError, addToCartIsError, addToCartIsSuccess]);

  if (isLoading)
    return (
      <>
        (<Loader className="text-center text-xl" />)
      </>
    );
  if (isError && error)
    return (
      <>
        <p>{error?.data?.message}</p>
      </>
    );
  return (
    <div className="w-full">
      <h1 className="font-bold text-center text-2xl p-5 ">WishList Products</h1>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-3 ">
        {wishlist?.length > 0 ? (
          wishlist?.map((product) => (
            <Card className="w-full max-w-xl" key={product._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    {name}
                  </CardTitle>
                  <Badge
                    variant={product?.shipping ? "default" : "outline"}
                    className="p-1"
                  >
                    {product?.shipping ? "Shipping Available" : "No Shipping"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <Link to={`product/${product._id}`}>
                    {/* Image */}
                    <div className="relative aspect-video">
                      <img
                        src={product?.image.url}
                        alt={product?.name}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </div>
                  </Link>
                  {/* Description */}
                  <p className="text-gray-700 truncate">
                    {product?.description}
                  </p>

                  {/* Price and Quantity */}
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-green-600">
                      ₹{product?.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: {product?.quantity}
                    </p>
                  </div>
                  <div className="flex justify-between my-2">
                    <Button onClick={() => handleAddToCart(product._id)}>
                      {addToCartIsLoading ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : (
                        "Add to Cart"
                      )}
                    </Button>
                    <Button
                      disabled={removeIsLoading}
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      variant={"outline"}
                    >
                      {removeIsLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        "    Remove from Wishlist"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-xl font-bold">
            No Product in wishlist
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
