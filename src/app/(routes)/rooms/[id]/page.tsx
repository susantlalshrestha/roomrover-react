import { getRoom } from "@roomrover/app/(lib)/actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { id: string };
};

const Page: React.FC<Props> = async ({ params }) => {
  const roomAd = (await getRoom(params.id))?.data?.roomAd;

  if (!roomAd) redirect("/home");

  return (
    <div className="flex flex-row w-full border-b">
      <div className="w-1/3 flex-col my-6 mx-10">
        <div className="carousel w-full aspect-video">
          {roomAd.images.map((image, index) => {
            return (
              <div
                key={index}
                id={`item${index}`}
                className="carousel-item w-full"
              >
                <Image
                  src={image}
                  width={1000}
                  height={1000}
                  alt={image}
                  className="w-full object-cover object-center aspect-video"
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center w-full py-2 gap-2">
          {roomAd.images.map((_, index) => {
            return (
              <a key={index} href={`#item${index}`} className="">
                {index + 1}
              </a>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col my-6 mx-10">
        <p className="flex items-center gap-2 rounded-sm mb-4 text-sm">
          # ID: {roomAd.id}
        </p>
        <p className="flex items-center gap-2 rounded-sm mb-4 text-lg">
          Title: {roomAd.title}
        </p>
        <p className="flex items-center gap-2 rounded-sm mb-4 text-xl">
          Price: {roomAd.price}
        </p>
        <p className="flex items-center gap-2 rounded-sm mb-4 text-sm">
          {roomAd.description}
        </p>
      </div>
    </div>
  );
};

export default Page;
