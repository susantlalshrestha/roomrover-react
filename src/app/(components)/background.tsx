import Image from "next/image";

const Background: React.FC = () => {
  return (
    <div className="fixed flex -z-50 w-full h-full">
      <Image
        src="/images/background.png"
        alt="Background Image"
        className="object-cover object-center"
        fill
      />
    </div>
  );
};

export default Background;
