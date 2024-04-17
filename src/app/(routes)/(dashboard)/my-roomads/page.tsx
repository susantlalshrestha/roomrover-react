import {
  getRooms,
  publishRoom,
  sessionAccount,
} from "@roomrover/app/(lib)/actions";
import { Role } from "@roomrover/app/models";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import { BsBuildingAdd } from "react-icons/bs";
import { isEmpty } from "lodash";

type Props = {};

const Page: React.FC<Props> = async ({}) => {
  let account = await sessionAccount();
  if (!account?.roles.includes(Role.HOST)) notFound();

  const roomAds = (await getRooms())?.data?.roomAds;

  return (
    <main className="flex flex-col flex-1 py-5 -z-10">
      <div className="flex justify-end mx-10 -z-10">
        <Link href="/rooms/create" className="btn text-teal-900 -z-10">
          <BsBuildingAdd />
          Add new room ad +
        </Link>
      </div>
      <div className="flex flex-col flex-1 my-6 mx-10 card rounded-md text-sm">
        {(!roomAds || isEmpty(roomAds)) && (
          <p className="p-4 absolute text-center self-center">No room added</p>
        )}
        <table className="divide-x">
          <thead className="bg-blur border-b border-teal-900/10">
            <tr className="">
              <th className="font-semibold p-4">SN</th>
              <th className="font-semibold p-4">Title</th>
              <th className="font-semibold p-4">Description</th>
              <th className="font-semibold p-4">Price</th>
              <th className="font-semibold p-4">Action</th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll items-start">
            {roomAds?.map(
              ({ id, title, description, price, published }, index) => {
                return (
                  <tr key={id} className="border-b border-teal-900/10">
                    <td className="p-4 max-h-24 text-center">{index + 1}</td>
                    <td className="p-4 max-h-24">{title}</td>
                    <td className="p-4 max-h-4 max-w-96 truncate text-ellipsis">
                      {description}
                    </td>
                    <td className="p-4 max-h-24 text-center">{price}</td>
                    <td className="p-4 max-h-24 text-center">
                      <div className="flex divide-x">
                        <Link href={`/rooms/${id}/edit`} className="flex-1">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Page;
