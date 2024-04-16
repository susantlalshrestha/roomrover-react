import Header from "../(components)/header";
import SideBar from "../(components)/sidebar";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="fixed w-full h-full flex flex-col backdrop-blur-md">
      <Header className="flex h-[12%] border-b border-teal-400 bg-opacity-20 bg-teal-50" />
      <div className="flex flex-1 ">
        <SideBar className="flex w-1/5 border-r border-teal-400 bg-opacity-20 bg-teal-50" />
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
};

export default RootLayout;
