/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useAddProductMutation } from "@/features/api's/productApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AddProduct = ({ open, setOpen }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    quantity: "",
    image: null,
    shipping: false,
  });

  const { data } = useGetAllCategoryQuery();
  const { categories } = data || [];
  const [
    addProduct,
    {
      data: addData,
      isSuccess: addIssuccess,
      isLoading: addIsLoading,
      error: addError,
      isError: addIsError,
    },
  ] = useAddProductMutation();
  

  const handleChange = (key, value) => {
    setProductData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleChange("image", file);
  };

  const handleSubmit = () => {
    if (
      !productData.name ||
      !productData.description ||
      !productData.price ||
      !productData.categoryId
    ) {
      alert("Please fill all required fields!");
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
      formData.append("image", productData.image); // Attach the file
    }
  
    addProduct(formData);
  };
  
  useEffect(() => {
    if (addData && addIssuccess) {
      toast.success(addData.message || "Product added Successfully.");
      setOpen(false);
    }
    if (addIsError && addError) {
      toast.error(addError.data.message || "Internal server error");
    }
  }, [addData, addError, addIsError, addIssuccess, setOpen]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Fill out the fields below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
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
          <div className="grid grid-cols-4 items-center gap-4 ">
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
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={addIsLoading}>
            {addIsLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              "Save Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
