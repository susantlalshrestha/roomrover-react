import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { auth, AuthUser, signOut } from "../../../auth";

type SideBarProps = {
  className?: string | undefined;
};

const SideBar: React.FC<SideBarProps> = async ({ className }) => {
  const authdata = await auth();
  const user: AuthUser | null | undefined = authdata?.user;

  return (
    <div
      className={
        className +
        " flex flex-col items-center p-2 divide-y divide-teal-400 divide-opacity-80"
      }
    >
      <div className="w-full aspect-video flex flex-col justify-center items-center">
        <Image
          src="/images/profile.png"
          alt="Profile Image"
          className="w-20 object-scale-down aspect-square object-center rounded-full card-accent"
          width={20}
          height={20}
        />
        {user && <p className="p-2">{`Hello, ${user.firstName}`}</p>}
      </div>
      <nav className="w-full flex-1 flex flex-col items-center">
        <Link href="/" className="nav-item-active w-full">
          Home
        </Link>
      </nav>
      <div className="w-full flex flex-col items-center">
        {authdata?.user?.id ? (
          <>
            <LogoutButton
              className="btn w-full"
              onclick={async () => {
                "use server";
                await signOut();
              }}
            />
          </>
        ) : (
          <>
            <Link href="/auth/login" className="btn-accent w-full">
              Login
            </Link>
            <Link href="/auth/register" className="btn w-full">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
