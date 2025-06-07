import { useNavigate } from "react-router-dom";

// OrderSuccess.jsx
const OrderSuccess = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/orders");
  };
  return (
    <div className="text-center flex justify-center items-center w-full h-screen">
      <div className="flex justify-center items-center gap-2 flex-col h-[200px] w-[300px] shadow-lg">
        <h1 className="text-2xl font-bold">Payment Successful ✅</h1>
        <p>Thank you for your order.</p>
        <button
          onClick={handleNavigate}
          className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-700 cursor-pointer duration-300 text-white "
        >
          Go to orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
