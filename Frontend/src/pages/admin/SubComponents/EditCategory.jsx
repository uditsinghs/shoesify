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
import { useUpdateCategoryMutation } from "@/features/api's/categoryApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const EditCategory = ({ open, setOpen, updateCategoryValue }) => {
  const [categoryname, setcategoryname] = useState("");
  const [cid, setCid] = useState("");

  const [updateCategory, { data, isLoading, isSuccess, isError, error }] =
    useUpdateCategoryMutation();
  useEffect(() => {
    setcategoryname(updateCategoryValue.categoryname);
    setCid(updateCategoryValue._id);
  }, [updateCategoryValue]);

  const handleUpdateCategory = () => {
    updateCategory({ categoryname, cid });
    setOpen(false);
  };

  useEffect(() => {
    if (data && isSuccess) {
      toast.success(data?.message);
    }
    if (isError && error) {
      toast.error(error?.response?.data.message);
    }
  }, [data, error, isError, isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to your Category here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Cateogry
            </Label>
            <Input
              value={categoryname}
              className="col-span-3"
              onChange={(e) => setcategoryname(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateCategory} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategory;
