"use client";

import React from "react";
import Link from "next/link";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="top-0 navbar justify-center items-center z-20 gap-2">
      <hr className="w-full border-gray-400/20 border-1" />
      <Link href="/" passHref className="flex items-center m-8 hover:opacity-80">
        <h1 className="text-4xl font-bold m-0">EVM.SLOTS</h1>
      </Link>
      <hr className="w-full border-gray-400/20 border-1" />
    </div>
  );
};
