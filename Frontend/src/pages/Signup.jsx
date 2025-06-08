import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegisterUserMutation } from "@/features/api's/userApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [registerUser, { data, isLoading, isError, isSuccess, error }] =
    useRegisterUserMutation();

  useEffect(() => {
    if (data && isSuccess) {
      toast.success(data?.message || "Signup successfully");
      setInput({
        username: "",
        email: "",
        password: "",
      });
      navigate("/login");
    }
    if (error && isError) {
      toast.error(error?.data?.message || "Error in Signup");
    }
  }, [error, isSuccess, isError]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSignup = () => {
    registerUser(input);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-white">
      <Card className="max-w-md w-full p-6 bg-zinc-700 rounded-xl shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
          <p className="text-zinc-400 text-center mt-1">
            Create your account to get started!
          </p>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-zinc-300">
              Username
            </label>
            <Input
              name="username"
              value={input.username}
              onChange={handleOnChange}
              type="text"
              placeholder="Enter your username"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-zinc-300">
              Email
            </label>
            <Input
              name="email"
              value={input.email}
              onChange={handleOnChange}
              type="email"
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-zinc-300">
              Password
            </label>
            <Input
              name="password"
              value={input.password}
              onChange={handleOnChange}
              type="password"
              placeholder="Enter your password"
              className="mt-1"
            />
          </div>
        </div>
        <CardFooter className="flex flex-col gap-4 mt-4">
          <Button
            onClick={handleSignup}
            className="w-full bg-zinc-600 hover:bg-zinc-500"
          >
            {isLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              "  Create Account"
            )}
          </Button>
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-zinc-200 underline hover:text-zinc-100"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
