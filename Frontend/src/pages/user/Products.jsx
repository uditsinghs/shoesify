/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Product from "./Product";
import { useGetPaginatedProductsQuery } from "@/features/api's/productApi";

const Products = ({ searchTerm }) => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  const { data, isLoading, isFetching, isError, error } = useGetPaginatedProductsQuery({
    page,
    search: searchTerm,
  });

  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [searchTerm]);

  useEffect(() => {
    if (data?.products) {
      setAllProducts((prev) => (page === 1 ? data.products : [...prev, ...data.products]));
    }
  }, [data, page]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );

  if (isError && error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
        {allProducts?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      {data?.hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {isFetching ? (
              <>
                <Loader2 className="animate-spin inline-block mr-2" /> Loading More
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {!data?.hasMore && !isLoading && (
        <p className="text-center text-gray-500 mt-6">No more products to show.</p>
      )}
    </div>
  );
};

export default Products;
