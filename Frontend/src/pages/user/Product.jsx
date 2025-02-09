/* eslint-disable react/prop-types */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAddToWishistMutation } from "@/features/api's/productApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAddToCartMutation } from "@/features/api's/cartApi";

const Product = ({ product }) => {
  const { name, description, price, quantity, image, shipping } = product;
  const [addToWiselist, { data, isLoading, isSuccess, error, isError }] =
    useAddToWishistMutation();
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
  const handleAddToCart = (pid) => {
    addToCart(pid);
  };

  const handleAddToWishlist = (pid) => {
    addToWiselist(pid);
  };

  useEffect(() => {
    if (data && isSuccess) {
      toast.success(data?.message || "Add to Cart Successfully");
    }
    if (error && isError) {
      toast.error(error.data.message || "Internal server error");
    }
    if (addToCartData && addToCartIsSuccess) {
      toast.success(addToCartData?.message || "Added to cart");
    }
    if (addToCartIsError && addToCartError) {
      toast.error(addToCartError?.data?.message || "Internal server error");
    }
  }, [
    error,
    isError,
    isSuccess,
    addToCartIsSuccess,
    addToCartIsError,
    addToCartError,
  ]);
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          <Badge variant={shipping ? "default" : "outline"} className="p-1">
            {shipping ? "Shipping Available" : "No Shipping"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Link to={`product/${product._id}`}>
            {/* Image */}
            <div className="relative aspect-video">
              <img
                src={image.url}
                alt={name}
                className="rounded-md object-cover w-full h-full"
              />
            </div>
          </Link>
          {/* Description */}
          <p className="text-gray-700 truncate">{description}</p>

          {/* Price and Quantity */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-green-600">
              ₹{price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Stock: {quantity}</p>
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
              onClick={() => handleAddToWishlist(product._id)}
              variant={"outline"}
            >
              {isLoading ? (
                <Loader2 className="mr-2 animate-spin h-4 w-4" />
              ) : (
                "  Add to Wishlist"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Product;
