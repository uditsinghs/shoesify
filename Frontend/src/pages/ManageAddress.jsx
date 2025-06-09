/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from "@/features/api's/userApi";
import { toast } from "sonner";

const ManageAddress = ({redirectTo="/profile"}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // Assume Redux state provides the user data.
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [addAddress, { data, error, isError, isSuccess, isLoading }] =
    useAddAddressMutation();
  const [
    updateAddress,
    {
      data: updateAddressData,
      isError: updateIserror,
      isSuccess: updateIsSuccess,
      error: updateError,
    },
  ] = useUpdateAddressMutation();
  const [
    deleteAddress,
    {
      data: deleteData,
      isSuccess: deleteIsSucces,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeleteAddressMutation();

  // Prepopulate the form if the user has an address
  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdateAddress = () => {
    if (user?.address) {
      updateAddress(address);
    } else {
      addAddress(address);
    }
  };

  const handleDeleteAddress = () => {
    deleteAddress();
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Address added successfully");
    }
    if (isError && error) {
      toast.error(error?.data?.message || "Error in added address");
    }
  }, [isError, error, isSuccess, data]);
  useEffect(() => {
    if (updateIsSuccess && updateAddressData) {
      toast.success(
        updateAddressData?.message || "Address updated successfully"
      );
      if (redirectTo === "back") {
        window.history.back();
      } else if (redirectTo === "referer") {
        window.location.href = document.referrer;
      } else {
        navigate(redirectTo);
      }
    
    }
    if (updateIserror && updateError) {
      toast.error(updateError?.data?.message || "Error in updating address");
    }
  }, [navigate, redirectTo, updateAddressData, updateError, updateIsSuccess, updateIserror]);
  useEffect(() => {
    if (deleteIsSucces && deleteData) {
      toast.success(deleteData?.message || "Address deleted successfully");
    if (redirectTo === "back") {
        window.history.back();
      } else if (redirectTo === "referer") {
        window.location.href = document.referrer;
      } else {
        navigate(redirectTo);
      }
    }
    if (deleteIsError && deleteError) {
      toast.error(deleteError?.data?.message || "Error in deleting address");
    }
  }, [deleteData, deleteError, deleteIsError, deleteIsSucces, navigate]);
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full flex justify-center items-center">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {user?.address ? "Update Address" : "Add Address"}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {user?.address
              ? "Update your existing delivery address."
              : "Provide the details to receive your deliveries."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <Input
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <Input
                  name="zip"
                  value={address.zip}
                  onChange={handleChange}
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Input
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Link to="/profile">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleAddOrUpdateAddress} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : user?.address ? (
              "Update "
            ) : (
              "Add "
            )}
          </Button>
          {user?.address && (
            <Button
              disabled={deleteLoading}
              onClick={handleDeleteAddress}
              className="bg-red-500 hover:bg-red-600 duration-300"
            >
              {deleteLoading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                "Delete "
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageAddress;
