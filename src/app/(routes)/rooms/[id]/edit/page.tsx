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
    <div className="flex flex-row border-b">
      <UpdateForm roomAd={roomAd} />
      <UploadForm roomAd={roomAd} />
    </div>
  );
};

export default Page;
