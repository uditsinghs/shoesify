import { useResetPasswordMutation } from "@/features/api's/userApi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const [resetPassword, { isSuccess, isError, isLoading, error, data }] =
    useResetPasswordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({ password, token }); // ✅ fix here
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Password reset");
      setPassword("");
      navigate("/login");
    }

    if (isError && error) {
      toast.error(error?.data?.message || "Internal server error");
    }
  }, [data, error, isError, isSuccess, navigate]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center flex-col gap-4"
      >
        <input
          type="password"
          name="password"
          className="py-2 text-xl shadow-sm border text-center"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-red-600 py-2 px-6 text-white hover:bg-red-700 rounded-md duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
