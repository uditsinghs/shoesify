
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Products from "./Products";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();


  // if the user role is admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div className="w-full grid grid-cols-1 gap-4 px-4 md:px-8 py-6">
      {/* Search and Carousel Section */}
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="w-full max-w-2xl mx-auto flex">
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-center p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500"
            aria-label="Search Products"
          />
        </div>

        {/* Products Section */}
        <div className="mt-4">
          <Products searchTerm={debouncedSearch} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
