"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export type NavMenuItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

type Props = {
  navMenus: Array<NavMenuItem>;
  containerClass?: string;
};

const NavBar: React.FC<Props> = ({ navMenus, containerClass }) => {
  const pathname = usePathname();

  return (
    <nav className={(containerClass && containerClass) + " flex text-sm"}>
      {navMenus?.map(({ href, title, icon }, index) => (
        <Link
          key={index}
          href={href}
          className={
            "flex justify-end items-end hover:scale-110 transition-transform duration-300 mx-2 " +
            (pathname === href && "font-bold border-b border-teal-900")
          }
        >
          {icon}
          <span className="mx-2 text-xs capitalize">{title}</span>
        </Link>
      ))}
    </nav>
  );
};

export default NavBar;
