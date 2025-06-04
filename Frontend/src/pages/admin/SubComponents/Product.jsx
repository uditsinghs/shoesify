/* eslint-disable react/prop-types */

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,

} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  const {
    name,
    description,
    price,
    quantity,
    image,
    shipping,
  } = product;

  return (
    <Link to={`update/${product._id}`}>
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          <Badge variant={shipping ? "default" : "outline"}  className="p-1">
            {shipping ? "Shipping Available" : "No Shipping"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-video">
            <img
              src={image.url}
              alt={name}
              className="rounded-md object-cover w-full h-full"
            />
          </div>

          {/* Description */}
          <p className="text-gray-700 truncate">{description}</p>

          {/* Price and Quantity */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-green-600">
              ₹{price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Stock: {quantity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default Product;
