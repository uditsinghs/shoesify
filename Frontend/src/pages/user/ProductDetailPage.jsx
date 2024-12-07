import { Button } from "@/components/ui/button";
import { useAddToCartMutation } from "@/features/api's/cartApi";
import { useGetSingleProductQuery } from "@/features/api's/productApi";
import { Loader, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { pid } = useParams();
  const { data, isLoading, error, isError } = useGetSingleProductQuery(pid);
  const { product } = data || {};

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
  const handleAddToCart = () => {
    addToCart(pid);
  };

  useEffect(() => {
    if (addToCartData && addToCartIsSuccess) {
      toast.success(addToCartData?.message || "Added to cart");
    }
    if (addToCartIsError && addToCartError) {
      toast.error(addToCartError?.data?.message || "Internal server error");
    }
  }, [addToCartError, addToCartIsError, addToCartIsSuccess]);
  if (isLoading)
    return (
      <p className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-gray-600" />
      </p>
    );
  if (isError && error) return <p>{error?.data?.message}</p>;

  return (
    <>
      <Button className="mx-4">
        <Link to="/">BACK</Link>
      </Button>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 p-5 max-w-7xl mx-auto">
        {/* Product Image Section */}
        <div className="flex justify-center items-center bg-gray-100 p-5 rounded-lg shadow-md ">
          <img
            src={product?.image.url}
            alt="product-image"
            className="object-contain max-w-full max-h-96 rounded"
          />
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col gap-4 justify-center">
          <h1 className="text-3xl font-bold text-gray-800">{product?.name}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product?.description}
          </p>
          <hr className="border-gray-300" />

          {/* Price and Shipping Info */}
          <div className="flex justify-between items-center text-gray-700">
            <p className="font-medium">
              Shipping:{" "}
              <span className="font-semibold">
                {product?.shipping ? "Available" : "Unavailable"}
              </span>
            </p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{product?.price}
            </h2>
          </div>
          <hr className="border-gray-300" />

          {/* Stock Info */}
          <p className="text-gray-700 font-medium">
            In Stock: <span className="font-bold">{product?.quantity}</span>
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            {addToCartIsLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              "    Add to Cart"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
