import { Button } from "@/components/ui/button";
import Product from "./SubComponents/Product";
import { useGetAllProductsQuery } from "@/features/api's/productApi";
import { Loader } from "lucide-react";
import { useState } from "react";
import AddProduct from "./SubComponents/AddProduct";

const ManageProduct = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error } = useGetAllProductsQuery();
  const { products } = data || [];

  if (isLoading)
    return (
      <span className="text-center">
        <Loader />
      </span>
    );
  if (isError && error) return <p>{error.message}</p>;
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(!open)}>Add Product</Button>
        <AddProduct open={open} setOpen={setOpen}/>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
        {products?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ManageProduct;
