import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoginUserMutation } from "@/features/api's/userApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { data, isError, error, isLoading, isSuccess }] =
    useLoginUserMutation();

  useEffect(() => {
    if (data && isSuccess) {
      toast.success(data?.message || "Logged in successfully");
      setInput({
        email: "",
        password: "",
      });
      if (data?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
    if (error && isError) {
      toast.error(error?.data?.message || "Error in Login");
    }
  }, [error, isSuccess, isError, data, navigate]);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleLogin = () => {
    loginUser(input);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-white">
      <Card className="max-w-md w-full p-6 bg-zinc-700 rounded-xl shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">Login</h1>
          <p className="text-zinc-400 text-center mt-1">
            Login your account to get started!
          </p>
        </CardHeader>
        <div className="space-y-4">
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
            onClick={handleLogin}
            className="w-full bg-zinc-600 hover:bg-zinc-500"
          >
            {isLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              "  Login"
            )}
          </Button>
          <button className="text-white underline">
            <Link to={"/forgot-password"}>Forgot Password</Link>
          </button>

          <p className="text-center text-sm text-zinc-400">
            Don&lsquo;t have an account?{" "}
            <Link
              to="/signup"
              className="text-zinc-200 underline hover:text-zinc-100"
            >
              Signup
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
