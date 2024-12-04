import React, { useEffect, useState } from "react";
import { Heart, Loader2, ShoppingCartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { userLoggedOut } from "@/features/Slices/userSlice";
import { toast } from "sonner";
import { useLogoutUserMutation } from "@/features/api's/userApi";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [logoutUser, { data, isLoading, isSuccess, isError, error }] =
    useLogoutUserMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logoutUser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logout successfully");
    }
    if (error && isError) {
      toast.error(error?.response?.data?.message || "Error in logout");
    }
  }, []);
  return (
    <nav className="w-full bg-gray-700 text-white">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center px-6 h-[100px]">
        <div>
          <Link to="/">
            <img
              src="../../public/images/skechers-logo.png"
              alt="logo"
              className="w-20 h-20 object-contain"
            />
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/wishlist" className="hover:text-gray-300">
            <Heart />
          </Link>
          <Link to="/cart" className="hover:text-gray-300">
            <ShoppingCartIcon />
          </Link>
          {user?.role === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger>Admin</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/admin">Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>User</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Button onClick={handleLogout}>
                    {" "}
                    {isLoading ? (
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    ) : (
                      "Logout"
                    )}
                  </Button>
                </DropdownMenuItem> */}
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
          <img
            src="../../public/images/skechers-logo.png"
            alt="logo"
            className="w-14 h-14 object-contain"
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/wishlist"
                className="hover:text-gray-300 flex items-center gap-2"
              >
                <Heart /> Favorites
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-gray-300 flex items-center gap-2"
              >
                <ShoppingCartIcon /> Cart
              </Link>
            </li>
            {user?.role === "admin" ? (
              <>
                <li>
                  <Link to="/profile" className="hover:text-gray-300">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-gray-300">
                    Dashboard
                  </Link>
                </li>
                <li>
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
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/profile" className="hover:text-gray-300">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-gray-300">
                    Orders
                  </Link>
                </li>
                <li>
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
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
