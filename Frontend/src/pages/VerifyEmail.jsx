import { useVerifyEmailMutation } from "@/features/api's/userApi";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const res = await verifyEmail(token).unwrap();
        toast.success(res?.message || "Email verified successfully");
        navigate("/login");
      } catch (err) {
        toast.error(err?.data?.message || "Invalid or expired token");
        navigate("/register");
      }
    };

    if (token) {
      handleVerification();
    }
  }, [token, verifyEmail, navigate]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <h1 className="text-xl font-semibold">
        {isLoading ? "Verifying your email..." : "Processing..."}
      </h1>
    </div>
  );
};

export default VerifyEmail;
