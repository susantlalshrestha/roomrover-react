import Image from "next/image";
import Link from "next/link";
import { Account } from "../models";
import NavBar, { NavMenuItem } from "./navbar";

type HeaderProps = {
  className?: string | undefined;
  title?: string | undefined;
  account?: Account;
  authMenus?: Array<() => React.ReactNode>;
  navMenus?: Array<NavMenuItem>;
  noGreet?: boolean;
};

const Header: React.FC<HeaderProps> = async ({
  className,
  title,
  account,
  authMenus,
  navMenus,
  noGreet,
}) => {
  return (
    <header
      className={
        className + " items-center p-10 backdrop-blur-xl bg-white/30 shadow-sm"
      }
    >
      <div className="justify-start items-center">
        <Link href="/" replace className="text-lg font-bold text-teal-900">
          {title || "Room Rover"}
        </Link>
      </div>
      <NavBar
        navMenus={navMenus || []}
        containerClass="flex-1 mx-14 justify-start items-center"
      />
      <div className="flex justify-end items-center">
        {!noGreet && (
          <p className="text-teal-900 font-bold text-sm mx-4">
            Hello, {account?.firstName || "Welcome"}
          </p>
        )}
        {authMenus && (
          <details className="dropdown dropdown-end">
            <summary>
              <Image
                src="/images/profile.png"
                alt="Profile Image"
                className="w-12 object-scale-down aspect-square object-center rounded-full bg-amber-50  shadow-sm hover:shadow-lg hover:shadow-amber-600/25 transition-shadow duration-300 ease-out"
                width={20}
                height={20}
              />
            </summary>
            <ul className="menu dropdown-content w-52 mt-8 backdrop-blur-xl bg-white/30 shadow-xl rounded">
              {authMenus?.map((menu, index) => (
                <li key={index} className="my-1">
                  {menu()}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </header>
  );
};

export default Header;
