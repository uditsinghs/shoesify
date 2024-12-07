import { useGetAllCategoryQuery } from "@/features/api's/categoryApi";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FilterAndSorting = () => {
  const [sortOption, setSortOption] = useState("relevance");
  const [categories, setCategories] = useState({});
  const { data } = useGetAllCategoryQuery();
  const { categories: categoryList } = data || {};
  console.log(categoryList);

  const handleCategoryChange = (category) => {
    setCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const applyFilters = () => {};

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-semibold mb-4">Filter & Sort</h2>

      {/* Sorting Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sort by:</label>
        <Select
          onValueChange={(value) => setSortOption(value)}
          value={sortOption}
          defaultValue={setSortOption}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
            <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Categories:</h3>
        <div className="space-y-2">
          {categoryList?.map((category) => (
            <label key={category._id} className="flex items-center gap-2">
              <Checkbox
                checked={categories[category.categoryname] || false}
                onCheckedChange={() =>
                  handleCategoryChange(category.categoryname)
                }
              />
              {category.categoryname.charAt(0).toUpperCase() +
                category.categoryname.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </Card>
  );
};

export default FilterAndSorting;
