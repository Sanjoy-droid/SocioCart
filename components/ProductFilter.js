"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function ProductFilters({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      <div
        className={`fixed lg:static inset-0 z-40 bg-white lg:bg-transparent transition-transform duration-300 lg:block ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full lg:h-auto overflow-y-auto p-6 lg:p-0">
          {/* Mobile Close Button */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Category</h3>
              <RadioGroup
                value={filters.category}
                onValueChange={(value) => {
                  setFilters({ ...filters, category: value });
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="cursor-pointer">
                    All Products
                  </Label>
                </div>
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value={cat} id={cat} />
                    <Label htmlFor={cat} className="cursor-pointer capitalize">
                      {cat}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, priceRange: value })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Sort By</h3>
              <RadioGroup
                value={filters.sortBy}
                onValueChange={(value) => {
                  setFilters({ ...filters, sortBy: value });
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default" className="cursor-pointer">
                    Default
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="price-low" id="price-low" />
                  <Label htmlFor="price-low" className="cursor-pointer">
                    Price: Low to High
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="price-high" id="price-high" />
                  <Label htmlFor="price-high" className="cursor-pointer">
                    Price: High to Low
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="rating" id="rating" />
                  <Label htmlFor="rating" className="cursor-pointer">
                    Highest Rated
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Reset Filters */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setFilters({
                  category: "all",
                  sortBy: "default",
                  priceRange: [0, 1000],
                });
                setIsOpen(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
