import { sessionAccount } from "@roomrover/app/(lib)/actions";
import Header from "../../(components)/header";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout: React.FC<AuthLayoutProps> = async ({ children }) => {
  let account = await sessionAccount();
  return (
    <div className="fixed w-full h-full flex flex-col backdrop-blur-md">
      <Header account={account} className="flex h-[10%]" noGreet={true} />
      <div className="flex flex-1 py-5 overflow-scroll">{children}</div>
    </div>
  );
};

export default RootLayout;
