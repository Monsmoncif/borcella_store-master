"use client";

import useCart from "@/lib/hooks/useCart";

import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Heart, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { assets } from "@/assets/assets";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="sticky top-0 z-10 py-2 px-10 flex gap-2 justify-between items-center bg-white max-sm:px-2">
      <Link href="/">
        <Image src={assets.logo} alt="logo" width={130} height={100} />
      </Link>

      <div className="flex gap-4 text-base-bold max-lg:hidden">
        <Link
          href="/"
          className={`hover:text-orange-600 ${
            pathname === "/" && "text-orange-600"
          }`}
        >
          Home
        </Link>

          <Link
          href="/shop"
          className={`hover:text-orange-600 ${
            pathname === "/shop" && "text-orange-600"
          }`}
        >
          Shop
        </Link>
       
        <Link
          href={user ? "/orders" : "/sign-in"}
          className={`hover:text-orange-600 ${
            pathname === "/orders" && "text-orange-600"
          }`}
        >
          Orders
        </Link>
      </div>

      <div className="flex gap-3 border border-grey-2 px-3 py-1 items-center rounded-[50px]">
       <form
  onSubmit={(e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  }}
  className="flex items-center"
>
  <input
    className="outline-none max-sm:max-w-[120px] rounded-[100px]"
    placeholder="Search..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <button
    type="submit"
    disabled={query.trim() === ""}
  >
    <Search className="cursor-pointer h-4 w-4 hover:text-orange-600 rounded-[100px]" />
  </button>
</form>

      </div>

     


      <div className="relative flex gap-3 items-center">
       
       
        <Link
          href="/cart"
          className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
        >
          <ShoppingCart size={20} />
          <p className=" absolute -top-1 -right-1  bg-orange-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center"> {cart.cartItems.length}</p>
        </Link>


         <Link
                 href={user ? "/wishlist" : "/sign-in"}
         
                className="hidden md:block lg:block p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <Heart size={20} />
              </Link>

        <Menu
          className="cursor-pointer lg:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />

        {dropdownMenu && (
          <div className="absolute top-12 right-5 flex flex-col gap-4 p-3 rounded-lg border bg-white text-base-bold lg:hidden">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <Link
              href={user ? "/shop" : "/sign-in"}
              className="hover:text-orange-600"
            >
              Shop
            </Link>
            <Link
              href={user ? "/orders" : "/sign-in"}
              className="hover:text-orange-600"
            >
              Orders
            </Link>

            
           
          </div>
        )}

        {user ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <CircleUserRound />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
