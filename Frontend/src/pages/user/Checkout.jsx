/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useGetCartProductQuery } from "@/features/api's/cartApi";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import ManageAddress from "../ManageAddress";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { data, isLoading } = useGetCartProductQuery();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
console.log(user);

  const cart = data?.products?.[0]?.products || [];

  const amount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  const handleCheckout = async () => {
    const { data } = await axios.post(
      "https://shoesify-backend.onrender.com/api/v1/order/create-order",
      {
        amount,
      },
      {
        withCredentials: true,
      }
    );
    const options = {
      key: "rzp_test_yB7zC3JVc87URz",
      amount: data?.order?.amount,
      currency: "INR",
      name: "E-com",
      description: "Thank you for shopping",
      order_id: data.order.id,
      handler: async (response) => {
        await axios.post(
          "https://shoesify-backend.onrender.com/api/v1/order/payment/verify",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cartItems: cart,
            userId: user._id,
            amount: amount,
          },
          {
            withCredentials: true,
          }
        );
        navigate("/order-success");
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Section */}
        <div className="w-full">
          <ManageAddress redirectTo="/checkout" />
        </div>

        {/* Summary + Payment Section */}
        <div className="w-full h-fit shadow-md rounded-md p-6 bg-white flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Checkout</h1>
          <p className="text-base md:text-lg font-semibold mb-2">
            Total Products: {cart?.length}
          </p>
          <p className="text-xl md:text-2xl font-bold mb-4">
            Total Price: ₹{amount}
          </p>
          <button
            onClick={handleCheckout}
            className="py-2 px-8 text-white rounded-md bg-green-500 hover:bg-green-600 transition duration-300"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
