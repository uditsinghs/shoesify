import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/features/api's/userApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
    answer: "",
  });
  const navigate = useNavigate();
  const [resetPassword, { data, isError, isLoading, isSuccess, error }] =
    useResetPasswordMutation();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  useEffect(() => {
    if (data && isSuccess) {
      toast.success(data?.message || "reset Password successfully");
      setInput({
        password: "",
        confirmPassword: "",
        answer: "",
      });
      navigate("/login");
    }
    if (error && isError) {
      toast.error(error?.data?.message || "Error in reset password");
    }
  }, [error, isSuccess, isError]);
  const handleResetPassword = () => {
    resetPassword({userData:input});
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-white">
      <Card className="max-w-md w-full p-6 bg-zinc-700 rounded-xl shadow-lg">
        <CardHeader>
        
          <p className="text-zinc-400 text-center mt-1">
            RESET PASSWORD 
          </p>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-zinc-300">
              New Password
            </label>
            <Input
              name="password"
              value={input.password}
              onChange={handleOnChange}
              type="password"
              placeholder="New password"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-zinc-300">
              Confirm Password
            </label>
            <Input
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={handleOnChange}
              type="password"
              placeholder="Confirm password"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-zinc-300">
              Who is your best friend
            </label>
            <Input
              name="answer"
              value={input.answer}
              onChange={handleOnChange}
              type="text"
              placeholder="eg-joe"
              className="mt-1"
            />
          </div>
        </div>
        <CardFooter className="flex flex-col gap-4 mt-4">
          <Button
            onClick={handleResetPassword}
            className="w-full bg-zinc-600 hover:bg-zinc-500"
          >
            {isLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              " Reset Password"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
