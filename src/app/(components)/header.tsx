type HeaderProps = {
  className?: string | undefined;
  title?: string | undefined;
};

const Header: React.FC<HeaderProps> = ({ className, title }) => {
  return (
    <header className={className + " flex items-center justify-center"}>
      <h1 className="font-bold text-teal-900">{title || "Room Rover"}</h1>
    </header>
  );
};

export default Header;
