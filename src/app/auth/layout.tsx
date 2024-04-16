import Header from "../(components)/header";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="fixed w-full h-full flex flex-col backdrop-blur-md">
      <Header className="absolute flex h-[12%] w-full border-b border-teal-400 bg-opacity-20 bg-teal-50" />
      <div className="flex flex-1 py-28 overflow-scroll">{children}</div>
    </div>
  );
};

export default RootLayout;
