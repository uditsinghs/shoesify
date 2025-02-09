/* eslint-disable react/prop-types */

import { useGetAllProductsQuery } from "@/features/api's/productApi";
import {  Loader2 } from "lucide-react";
import Product from "./Product";

const Products = ({ searchTerm }) => {
  const { data, isLoading, isError, error } = useGetAllProductsQuery();
  const { products } = data || [];

  // searching algo
  const filteredProduct = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <span className=" flex items-center justify-center">
        <Loader2 className="animate-spin "/>
        loading..
      </span>
    );
  if (isError && error) return <p>{error.message}</p>;
  return (
    <div className="w-full">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-3 ">
        {filteredProduct?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
