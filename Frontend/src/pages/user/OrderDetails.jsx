import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "@/features/api's/orderApi";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  console.log(order);
  

  if (!order) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>

      <Card className="shadow">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
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
            className="capitalize"
          >
            {order.status}
          </Badge>
        </CardHeader> 

        <CardContent>
          <p className="mb-2 font-semibold">Total Amount: ₹{order.amount}</p>
          <p className="font-medium mb-1">Products:</p>
          <ul className="pl-4 list-disc space-y-1 text-sm text-gray-700 mb-4">
            {order.products.map((item, i) => (
              <div key={i} className="list-none">
                <li>
                  {item.product.name} × {item.quantity}
                </li>
                <li>
                  <img src={item?.product?.image.url} alt="p.name" className="w-10" />
                </li>
              </div>
            ))}
          </ul>

          <p className="text-sm text-muted-foreground">
            Order placed by:{" "}
            <span className="font-medium">
              {order?.user?.username || "Unknown User"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
