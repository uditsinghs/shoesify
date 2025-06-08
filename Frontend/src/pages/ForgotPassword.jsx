import { useForgotPasswordMutation } from "@/features/api's/userApi";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isError, isLoading, isSuccess, error }] =
    useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await forgotPassword({ email });
    setEmail("");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center flex-col gap-4"
      >
        <input
          type="email"
          name="email"
          className="py-2 text-xl shadow-sm border text-center"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="bg-red-600 py-2 px-6 text-white hover:bg-red-700 rounded-md duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Forgot"}
        </button>

        {isSuccess && (
          <p className="text-green-600 font-medium">Check your email inbox!</p>
        )}
        {isError && (
          <p className="text-red-600 font-medium">
            {error?.data?.message || "Something went wrong"}
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
