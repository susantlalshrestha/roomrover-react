import React from "react";
import { RoomAd } from "../models";
import Image from "next/image";
import Link from "next/link";

type Props = { roomAd: RoomAd };

const RoomCard: React.FC<Props> = ({ roomAd }) => {
  return (
    <Link
      href={`/rooms/${roomAd.id}`}
      className="card rounded-md w-80 max-h-96 hover:shadow-2xl"
    >
      <figure>
        <Image
          src={roomAd.images[0]}
          width={1000}
          height={1000}
          alt={roomAd.title}
          className="w-full aspect-square object-cover object-center"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{roomAd.title}</h2>
        <p className="max-h-12 truncate text-xs">{roomAd.description}</p>
        <p className="">{`$ ${roomAd.price} /day`}</p>
      </div>
    </Link>
  );
};

export default RoomCard;
