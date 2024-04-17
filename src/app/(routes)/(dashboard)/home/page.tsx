import SearchBar from "@roomrover/app/(components)/search-bar";
import { getAllRooms, sessionAccount } from "@roomrover/app/(lib)/actions";
import { Role } from "@roomrover/app/models";
import Image from "next/image";
import React from "react";

type Props = {};

const Page: React.FC<Props> = async ({}) => {
  const account = await sessionAccount();

  let roomAds = (await getAllRooms())?.data?.roomAds;

  if (account && account?.roles.includes(Role.HOST)) return <main></main>;

  return (
    <main className="fixed w-full h-full flex flex-col backdrop-blur-md">
      {(!account || account?.roles.includes(Role.GUEST)) && (
        <SearchBar containerClass="p-4 flex justify-center items-center" />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  p-10 gap-10">
        {roomAds?.map(
          ({ id, title, description, price, published, images }, index) => {
            return (
              <div
                key={id}
                className="card rounded-md w-80 max-h-96 hover:shadow-2xl"
              >
                <figure>
                  <Image
                    src={images[0]}
                    width={1000}
                    height={1000}
                    alt={title}
                    className="w-full aspect-square object-cover object-center"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg">{title}</h2>
                  <p className="max-h-12 truncate text-xs">{description}</p>
                  <p className="">{`$ ${price} /day`}</p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </main>
  );
};

export default Page;
