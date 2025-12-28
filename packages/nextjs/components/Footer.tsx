import React from "react";
import Link from "next/link";
import { HeartIcon, HomeIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { BuidlGuidlLogo } from "~~/components/assets/BuidlGuidlLogo";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="fixed z-10 p-4 bottom-2 right-4 pointer-events-auto">
        <SwitchTheme />
      </div>

      <div className="flex space-x-2 h-8 items-center justify-center">
        <div className="fixed z-10 p-4 bottom-2 left-4">
          <Link href="/about" className="btn btn-info text-base-content p-3">
            <HomeIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <a href="https://github.com/scaffold-eth/se-2" target="_blank" rel="noreferrer" className="link">
                Fork me
              </a>
            </div>
            <span>·</span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> at
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://buidlguidl.com/"
                target="_blank"
                rel="noreferrer"
              >
                <BuidlGuidlLogo className="w-3 h-5 pb-1" />
                <span className="link">BuidlGuidl</span>
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
