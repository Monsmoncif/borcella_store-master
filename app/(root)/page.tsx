import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import CategoryScroller from "@/components/Categories";
import Collections from "@/components/Collections";
import HeroSlider from "@/components/HeroSlider";
import ProductList from "@/components/ProductList";

import Image from "next/image";

export default function Home() {
  return (
    <div className=" md:px-12 lg:px-26">
      <HeroSlider />
      <Collections />
      <Categories />
      <ProductList  />
      <Banner />
    </div>

  );
}

export const dynamic = "force-dynamic";

