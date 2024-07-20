"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";  
import { User } from "next-auth";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession(); //getting the session of user from client side

  const user: User = session?.user;
  console.log('the user is ', user);
  
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0"> True feedback</a>
        {session ? (
          <>
            <span className="mr-4">
              welcome , {user.username || user.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href={"/sign-in"}>
            <Button className="w-full md:w-auto bg-slate-100 text-black ">
              Login{" "}
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
