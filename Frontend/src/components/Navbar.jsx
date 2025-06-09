import { useEffect, useState } from "react";
import { Heart, Loader2, ShoppingCartIcon, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLogoutUserMutation } from "@/features/api's/userApi";
import { useGetCartProductQuery } from "@/features/api's/cartApi";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [logoutUser, { data, isLoading, isSuccess, isError, error }] =
    useLogoutUserMutation();

  const { data: cartData, refetch } = useGetCartProductQuery();
  const cart = cartData?.products?.[0]?.products || [];

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logout successfully");
      refetch();
    }
    if (error && isError) {
      toast.error(error?.data?.message || "Error in logout");
    }
  }, [error, isError, isSuccess]);

  return (
    <nav className="w-full bg-gray-700 text-white">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center px-6 h-[100px]">
        <div>
          <Link to="/">
            <img
              src="../../public/images/skechers-logo.png"
              alt="logo"
              className="w-40 h-40 object-contain"
            />
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          {user?.role !== "admin" && (
            <Link to="/wishlist" className="hover:text-gray-300">
              <Heart />
            </Link>
          )}

          {user?.role !== "admin" && (
            <Link to="/cart" className="hover:text-gray-300 relative">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cart?.length}
              </span>
              <ShoppingCartIcon />
            </Link>
          )}

          {user?.role === "customer" && (
            <DropdownMenu>
              <DropdownMenuTrigger>{user?.username}</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isAuthenticated ? (
            <Button onClick={handleLogout}>
              {isLoading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                "Logout"
              )}
            </Button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-[80px] bg-gray-700">
        <div>
          <Link to="/">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd_-G47cj-jPs7HiZdGQzyrlj-1lV5OSFBNg&s"
              alt="logo"
              className="w-20 h-20 object-contain"
            />
          </Link>
        </div>
        <Button
          variant="ghost"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && user?.role !== "admin" && (
        <div className="md:hidden bg-gray-800 text-white p-4 space-y-4">
          {isAuthenticated && (
            <>
              <Link to="/profile" className="block hover:text-gray-300">
                Profile
              </Link>
              <Link to="/orders" className="block hover:text-gray-300">
                Orders
              </Link>
              <Link to="/cart" className="block relative hover:text-gray-300">
                <span className="absolute -top-2 right-96 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart?.length}
                </span>
                <ShoppingCartIcon className="inline ml-2" />
              </Link>
              <Link to="/wishlist" className="block hover:text-gray-300">
                <Heart className="inline" />
              </Link>
              <Button onClick={handleLogout} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : (
                  "Logout"
                )}
              </Button>
            </>
          )}
          {!isAuthenticated && (
            <div className="flex gap-3 items-center ">
              <Link to="/login" className="block hover:text-gray-300">
                Login
              </Link>
              <Link to="/cart" className="block relative hover:text-gray-300">
                <span className="absolute -top-2 right-96 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart?.length}
                </span>
                <ShoppingCartIcon className="inline ml-2" />
              </Link>
              <Link to="/wishlist" className="block hover:text-gray-300">
                <Heart className="inline" />
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
