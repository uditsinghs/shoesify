import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useGetAllCategoryQuery } from "@/features/api's/categoryApi";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/features/api's/productApi";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UpdateProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    quantity: "",
    image: null,
    shipping: false,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const { data } = useGetAllCategoryQuery();
  const { categories } = data || [];

  const {
    data: singleProductData,
    isError: singleProductIsError,
    error: singleProductError,
    isLoading: singleProductIsLoading,
  } = useGetSingleProductQuery(pid);

  const { product } = singleProductData || {};
  const [
    updateProduct,
    {
      data: updateData,
      isSuccess: updateIsSuccess,
      isLoading: updateIsLoading,
      error: updateError,
      isError: updateIsError,
    },
  ] = useUpdateProductMutation();

  const [
    deleteProduct,
    {
      isLoading: deleteIsLoading,
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
    },
  ] = useDeleteProductMutation();

  const handleChange = (key, value) => {
    setProductData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleChange("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (
      !productData.name ||
      !productData.description ||
      !productData.price ||
      !productData.categoryId
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("categoryId", productData.categoryId);
    formData.append("quantity", productData.quantity);
    formData.append("shipping", productData.shipping);
    if (productData.image) {
      formData.append("image", productData.image);
    }

    updateProduct({ inputData: formData, pid });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(pid);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        categoryId: product.categoryId || "",
        quantity: product.quantity || "",
        image: null,
        shipping: product.shipping || false,
      });
    }
  }, [product]);

  console.log("img", imagePreview);

  useEffect(() => {
    if (updateData && updateIsSuccess) {
      toast.success(updateData.message || "Product updated Successfully.");
      navigate("/admin/product");
    }
    if (updateIsError && updateError) {
      toast.error(updateError?.data?.message || "Internal server error");
    }
    if (deleteIsSuccess) {
      toast.success("Product deleted successfully.");
      navigate("/admin/product");
    }
    if (deleteIsError && deleteError) {
      toast.error(deleteError?.data?.message || "Failed to delete product.");
    }
  }, [
    updateIsSuccess,
    updateIsError,
    updateError,
    deleteIsSuccess,
    deleteIsError,
    deleteError,
  ]);

  if (singleProductIsLoading) return <p>Loading...</p>;

  if (singleProductError && singleProductIsError)
    return <p>{singleProductError.message}</p>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-4">
            {/* Product Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Product Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                placeholder="Enter product name"
                value={productData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                placeholder="Enter product description"
                value={productData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            {/* Price */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                className="col-span-3"
                placeholder="Enter price"
                value={productData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>
            {/* Quantity */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                className="col-span-3"
                placeholder="Enter quantity"
                value={productData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </div>
            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                onValueChange={(value) => handleChange("categoryId", value)}
                value={productData.categoryId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.categoryname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Image Upload */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="col-span-3"
                onChange={handleFileChange}
              />
              <div>
                {imagePreview && <img src={imagePreview} alt="image-preview" />}
              </div>
            </div>
            {/* Shipping */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shipping" className="text-right">
                Shipping
              </Label>
              <Switch
                id="shipping"
                checked={productData.shipping}
                onCheckedChange={(checked) => handleChange("shipping", checked)}
              />
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteIsLoading}
            >
              {deleteIsLoading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 w-4 h-4" />
              )}
              Delete
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={updateIsLoading}
            >
              {updateIsLoading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UpdateProduct;
