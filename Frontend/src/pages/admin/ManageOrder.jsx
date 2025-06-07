import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/features/api's/orderApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const statusOptions = ["pending", "shipped", "delivered"];

const ManageOrder = () => {
  const { data, isLoading, isError } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      toast.success("Order deleted successfully");
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (isError || !data?.orders?.length) {
    return (
      <div className="text-center text-gray-500 mt-10">No orders available.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Orders</h1>

      {data.orders.map((order) => (
        <Card key={order._id} className="shadow-md">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <CardTitle className="text-sm md:text-lg font-semibold">
              Order ID: {order.orderId}
            </CardTitle>
            <Badge
              variant={
                order.status === "paid"
                  ? "default"
                  : order.status === "pending"
                  ? "secondary"
                  : "outline"
              }
              className="capitalize"
            >
              {order.status}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-2">
            <p className="text-sm">Total Amount: ₹{order.amount}</p>
            <p className="text-sm">
              User:{" "}
              <span className="font-medium">{order?.user?.username || "N/A"}</span>
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {order.products.map((item, i) => (
                <li key={i}>
                  {item.product.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 mt-4">
              <p className="text-sm font-medium">Change Status:</p>
              <div className="flex gap-4">
                {statusOptions.map((status) => (
                  <label
                    key={status}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={order.status === status}
                      onCheckedChange={() => handleStatusChange(order._id, status)}
                    />
                    <span className="capitalize text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleDelete(order._id)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManageOrder;
