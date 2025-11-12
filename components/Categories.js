"use client";

import { Shirt, Watch, Sparkles, Gem } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Men's Clothing",
    icon: Shirt,
    color: "from-blue-500 to-cyan-500",
    href: "/products?category=men's clothing",
  },
  {
    name: "Women's Clothing",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    href: "/products?category=women's clothing",
  },
  {
    name: "Electronics",
    icon: Watch,
    color: "from-purple-500 to-indigo-500",
    href: "/products?category=electronics",
  },
  {
    name: "Jewelery",
    icon: Gem,
    color: "from-amber-500 to-orange-500",
    href: "/products?category=jewelery",
  },
];

export default function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={category.href} className="group">
                <div
                  className="relative bg-white rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
