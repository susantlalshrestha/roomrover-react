import RoomCard from "@roomrover/app/(components)/room-card";
import SearchBar from "@roomrover/app/(components)/search-bar";
import { getAllRooms, sessionAccount } from "@roomrover/app/(lib)/actions";
import { Role } from "@roomrover/app/models";
import Image from "next/image";
import React from "react";

type Props = {
  searchParams?: {
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
};

const Page: React.FC<Props> = async ({ searchParams }) => {
  const account = await sessionAccount();

  const { maxPrice, minPrice, search } = searchParams || {};

  let filterText =
    minPrice && maxPrice
      ? `Filter: minimum price: ${minPrice}, maximum price: ${maxPrice}`
      : minPrice && !maxPrice
      ? `Filter: minimum price: ${minPrice}`
      : !minPrice && maxPrice
      ? `Filter: maximum price: ${maxPrice}`
      : undefined;

  if (search)
    filterText = filterText
      ? `, Search text: ${search}`
      : `Search text: ${search}`;

  let roomAds = (await getAllRooms(search, minPrice, maxPrice))?.data?.roomAds;

  if (account && account?.roles.includes(Role.HOST)) return <main></main>;

  return (
    <main className="fixed w-full h-full flex flex-col backdrop-blur-md">
      {(!account || account?.roles.includes(Role.GUEST)) && (
        <SearchBar containerClass="p-4 flex justify-center items-center" />
      )}
      {filterText && <p className="mx-14">{filterText}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  p-10 gap-10">
        {roomAds?.map((roomAd) => (
          <RoomCard roomAd={roomAd} key={roomAd.id} />
        ))}
      </div>
    </main>
  );
};

export default Page;
