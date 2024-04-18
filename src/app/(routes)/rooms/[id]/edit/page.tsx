import React from "react";
import UpdateForm from "./update-form";
import { getRoom } from "@roomrover/app/(lib)/actions";
import { redirect } from "next/navigation";
import UploadForm from "./upload-image";

type Props = {
  params: { id: string };
};

const Page: React.FC<Props> = async ({ params }) => {
  const roomAd = (await getRoom(params.id))?.data?.roomAd;

  if (!roomAd) redirect("/my-roomads");

  return (
    <div className="flex flex-row w-full border-b">
      <UploadForm roomAd={roomAd} className="w-1/3" />
      <UpdateForm roomAd={roomAd} className="flex-1" />
    </div>
  );
};

export default Page;
