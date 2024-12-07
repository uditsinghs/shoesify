import { useState } from "react";

const FilterAndSorting = () => {
  const [sortOption, setSortOption] = useState("relevance");
  const [categories, setCategories] = useState({
    electronics: false,
    fashion: false,
    books: false,
  });

  const handleCategoryChange = (category) => {
    setCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filter & Sort</h2>

      {/* Sorting Options */}
      <div className="mb-6">
        <label htmlFor="sort" className="block text-sm font-medium mb-2">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
        >
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Categories:</h3>
        <div className="space-y-2">
          {Object.keys(categories).map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={categories[category]}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
              />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={() => console.log({ sortOption, categories })}
        className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterAndSorting;
