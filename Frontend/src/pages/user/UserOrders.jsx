import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetOrdersQuery, useDeleteOrderMutation } from "@/features/api's/orderApi";
import { Loader2, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserOrders = () => {
  const { data, isLoading, isError, error, refetch } = useGetOrdersQuery();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const handleDelete = async (orderId) => {
    try {
      const res = await deleteOrder(orderId).unwrap();
      toast.success(res?.data?.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        {error?.data?.message || "Failed to fetch orders"}
      </div>
    );
  }

  if (!data?.orders?.length) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        No orders found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Your Orders</h1>

      {data.orders.map((order) => (
        <Card key={order._id} className="shadow-md border">
          <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
            <CardTitle className="text-base font-semibold">
              Order ID: <span className="text-muted-foreground">{order.orderId}</span>
            </CardTitle>
            <Badge
              variant={
                order.status === "paid"
                  ? "default"
                  : order.status === "pending"
                  ? "secondary"
                  : "outline"
              }
              className="capitalize w-14"
            >
              {order.status}
            </Badge>
          </CardHeader>

          <CardContent>
            <p className="font-semibold">Total Amount: ₹{order.amount}</p>
            <div className="mt-3">
              <p className="font-medium mb-1">Products:</p>
              <ul className="pl-4 list-disc space-y-1 text-sm text-gray-700">
                {order.products.map((item, i) => (
                  <li key={i}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={() => handleDelete(order._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserOrders;
