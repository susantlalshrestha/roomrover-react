import Header from "../../(components)/header";
import { Role } from "../../models";
import LogoutButton from "../../(components)/logout-button";
import { logout, sessionAccount } from "../../(lib)/actions";
import Link from "next/link";
import { IoHomeOutline, IoCalendarOutline } from "react-icons/io5";
import { TbMessage2 } from "react-icons/tb";
import { CiBookmark } from "react-icons/ci";
import { NavMenuItem } from "../../(components)/navbar";
import { permanentRedirect, redirect } from "next/navigation";
import { signOut } from "../../../../auth";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout: React.FC<LayoutProps> = async ({ children }) => {
  let account = await sessionAccount();

  const navMenus = () => {
    const menus: Array<NavMenuItem> = [];
    menus.push({
      title: "Home",
      href: "/home",
      icon: <IoHomeOutline className="text-lg" />,
    });
    if (account?.roles.includes(Role.GUEST)) {
      menus.push({
        title: "My Reservations",
        href: "/myreservations",
        icon: <IoCalendarOutline className="text-lg" />,
      });
      menus.push({
        title: "Messages",
        href: "/messages",
        icon: <TbMessage2 className="text-lg" />,
      });
      menus.push({
        title: "Saved Ads",
        href: "/savedads",
        icon: <CiBookmark className="text-lg" />,
      });
    }
    if (account?.roles.includes(Role.HOST)) {
      menus.push({
        title: "My RoomAds",
        href: "/my-roomads",
        icon: <IoCalendarOutline className="text-lg" />,
      });
      menus.push({
        title: "Messages",
        href: "/messages",
        icon: <TbMessage2 className="text-lg" />,
      });
      menus.push({
        title: "Reservations",
        href: "/reservations",
        icon: <CiBookmark className="text-lg" />,
      });
    }

    return menus;
  };

  const authMenus = () => {
    const menus = [];
    if (account) {
      menus.push(() => <LogoutButton className="w-full" onClick={logout} />);
    } else {
      menus.push(() => (
        <Link href="/auth/login" className="w-full">
          Login
        </Link>
      ));
      menus.push(() => (
        <Link href="/auth/register" className="w-full">
          Register
        </Link>
      ));
    }
    return menus;
  };

  return (
    <div className="fixed w-full h-full flex flex-col backdrop-blur-md">
      <Header
        className="flex h-[10%]"
        account={account}
        authMenus={authMenus()}
        navMenus={navMenus()}
      />
      <div className="flex flex-1 overflow-scroll -z-10">{children}</div>
    </div>
  );
};

export default RootLayout;
