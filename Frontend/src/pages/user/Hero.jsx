import Carousel from "@/components/Carousal";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import FilterAndSorting from "./FilterAndSorting";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50 py-8 px-4">
      {/* Filter and Sorting Section */}
      <div className="w-full md:w-[30%]">
        <FilterAndSorting />
      </div>

      {/* Search and Carousel Section */}
      <div className="w-full md:w-[70%] flex flex-col gap-6">
        {/* Search Bar */}
        <div className="w-full max-w-2xl mx-auto">
          <Input
            placeholder="Search by name, category, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-center p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Carousel */}
        <div className="w-full">
          <Carousel />
        </div>
      </div>
    </div>
  );
};

export default Hero;
