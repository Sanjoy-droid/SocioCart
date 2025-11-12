import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Categories />
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our handpicked collection</p>
          </div>
        </div>
        <ProductGrid />
      </section>
      <Newsletter />
    </main>
  );
}
