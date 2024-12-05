import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useChangeRoleMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/features/api's/userApi";
import { Loader2, LucideDelete } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const ManageUser = () => {
  const { data, isLoading, isError, error } = useGetAllUsersQuery();
  const { users } = data || [];
  const [
    deleteUser,
    {
      data: deleteUserData,
      isLoading: deleteUserIsLoading,
      isError: deleteUserIsError,
      error: deleteError,
      isSuccess: deleteUserIsSuccess,
    },
  ] = useDeleteUserMutation();

  const [
    changeRole,
    {
      data: changeRoleData,
      isSuccess: changeRoleIsSuccess,
      isError: changeRoleIsError,
      error: changeRoleError,
    },
  ] = useChangeRoleMutation();

  // Handle role change
  const handleChangeRole = (userId, newRole) => {
    changeRole({ userId, role: newRole });
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    deleteUser(userId);
  };

  // Handle delete user response
  useEffect(() => {
    if (deleteUserData && deleteUserIsSuccess) {
      toast.success(deleteUserData.message || "User deleted");
    }
    if (deleteError && deleteUserIsError) {
      toast.error(deleteError?.response?.data?.message || "Failed to delete user");
    }
  }, [deleteError, deleteUserIsError, deleteUserIsSuccess]);

  // Handle change role response
  useEffect(() => {
    if (changeRoleData && changeRoleIsSuccess) {
      toast.success(changeRoleData.message || "Role updated successfully");
    }
    if (changeRoleError && changeRoleIsError) {
      toast.error(changeRoleError?.response?.data?.message || "Failed to update role");
    }
  }, [changeRoleData, changeRoleError, changeRoleIsError]);

  if (isError) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 grid md:grid-cols-3 grid-cols-1 w-full gap-4">
      {users?.map((user) => (
        <Card key={user._id}>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-bold uppercase">
              {user?.username}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Email: <span>{user?.email}</span>
            </p>
            <div className="my-2">
              <Select
                onValueChange={(value) => handleChangeRole(user._id, value)}
                defaultValue={user.role}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end py-2">
              <Button
                variant={"destructive"}
                disabled={deleteUserIsLoading}
                onClick={() => handleDeleteUser(user._id)}
              >
                <LucideDelete size={16} className="mr-2" />
                {deleteUserIsLoading ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManageUser;
