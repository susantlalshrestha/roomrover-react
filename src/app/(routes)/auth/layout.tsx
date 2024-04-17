import Header from "../../(components)/header";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="fixed w-full h-full flex flex-col backdrop-blur-md">
      <Header className="flex h-[10%]" />
      <div className="flex flex-1 py-5 overflow-scroll">{children}</div>
    </div>
  );
};

export default RootLayout;
