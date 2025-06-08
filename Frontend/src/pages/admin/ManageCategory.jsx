import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideEdit, LucideDelete, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import EditCategory from "./SubComponents/EditCategory";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "@/features/api's/categoryApi";
import { toast } from "sonner";

const ManageCategory = () => {
  const [categoryname, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const [updateCategoryValue, setUpdateCategoryValue] = useState({});

  const [createCategory, { data, isError, isLoading, error, isSuccess }] =
    useCreateCategoryMutation();
  const [
    deleteCategory,
    {
      isLoading: deleteIsLoading,
      data: deleteData,
      isError: deleteIsError,
      error: deleteError,
      isSuccess: deleteIssuccess,
    },
  ] = useDeleteCategoryMutation();
  const {
    data: categoryData,
    isLoading: categoryIsLoading,
  } = useGetAllCategoryQuery();

  const { categories } = categoryData || {};
  // add categroy
  const handleAddCategory = () => {
    createCategory(categoryname);
  };

  // delete Category
  const handleDeleteCategory = (cid) => {
    deleteCategory(cid);
  };

  const handleEdit = (category) => {
    setUpdateCategoryValue(category);
    setOpen(!open);
  };

  // useEffect for add Category
  useEffect(() => {
    if (data && isSuccess) {
      toast.success(data?.message);
      setCategoryName("")
    }
    if (isError && error) {
      toast.error(
        error?.data.message || "Something went wrong to add Category"
      );
    }
  }, [error, isError, isSuccess]);

  // useEffect for delete Category
  useEffect(() => {
    if (deleteIssuccess && deleteData) {
      toast.success(deleteData?.message);
    }
    if (deleteIsError && deleteError) {
      toast.error(
        deleteError?.data.message ||
          "Something went wrong to delete Category"
      );
    }
  }, [deleteError, deleteIsError, deleteIssuccess]);

  if (categoryIsLoading)
    return (
      <>
        <p>Loading...</p>
      </>
    );


  return (
    <div className="p-6 md:p-10 flex flex-col max-w-4xl mx-auto gap-6">
      {/* Add Category Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-bold">
            Add Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter category name"
            className="w-full"
            onChange={(e) => setCategoryName(e.target.value)}
            value={categoryname}
          />
        </CardContent>
        <CardFooter>
          <Button
            disabled={isLoading}
            onClick={handleAddCategory}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Category List Section */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <Table className="min-w-full">
          <TableCaption className="text-sm">
            A list of all categories you have added.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">
                  {category.categoryname}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    onClick={() => handleEdit(category)}
                    variant="outline"
                    className="px-3"
                  >
                    <LucideEdit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(category._id)}
                    variant="destructive"
                    className="px-3"
                  >
                    <LucideDelete size={16} className="mr-2" />
                    {deleteIsLoading ? (
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          {setUpdateCategoryValue && (
            <EditCategory
              open={open}
              setOpen={setOpen}
              updateCategoryValue={updateCategoryValue}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCategory;
