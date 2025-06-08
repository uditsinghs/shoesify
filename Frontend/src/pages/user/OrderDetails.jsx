import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "@/features/api's/orderApi";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetOrderByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        {error?.data?.message || "Failed to load order details"}
      </div>
    );
  }

  const order = data?.order;

  if (!order) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <CardTitle className="text-base font-semibold">
            Order ID:{" "}
            <span className="text-muted-foreground">{order.orderId}</span>
          </CardTitle>
          <Badge
            variant={
              order.status === "paid"
                ? "default"
                : order.status === "pending"
                ? "secondary"
                : "outline"
            }
            className="capitalize text-sm"
          >
            {order.status}
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Total Amount: <span className="text-green-600">₹{order.amount}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Order placed by:{" "}
              <span className="font-medium">
                {order?.user?.username || "Unknown User"}
              </span>
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Ordered Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.products.map((item, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex items-start gap-4 shadow-sm bg-muted/30"
                >
                  <img
                    src={item?.product?.image?.url || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-medium">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
