"use client";

import { useFormState, useFormStatus } from "react-dom";
import { RoomAd, UpdateRoomAdResponse } from "@roomrover/app/models";
import { updateRoomAd, uploadRoomImage } from "@roomrover/app/(lib)/actions";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { storePhotos } from "@roomrover/app/(lib)/firebase";

type UploadProps = Readonly<{
  roomAd: RoomAd;
  containerClass?: string;
}>;

const UploadForm: React.FC<UploadProps> = ({ containerClass, roomAd }) => {
  const [state, action] = useFormState<UpdateRoomAdResponse, FormData>(
    updateRoomAd,
    { success: false }
  );

  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState<string[]>([]);
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);
  const [images, setImages] = useState<Blob[]>([]);

  const onAddClickHandler = useCallback(() => {
    (document.getElementById("image") as HTMLInputElement)?.click();
  }, [images, imagesUrls]);

  const onChangeHandler = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const file = files[0];
        setImages(images.concat([file]));
        setImagesUrls(imagesUrls.concat([URL.createObjectURL(file)]));
        console.log("Hllo");
      }
    },
    [images, imagesUrls]
  );

  const onSubmitHandler = useCallback(async () => {
    setPending(true);
    console.log(imagesUrls);
  }, [images, imagesUrls]);

  useEffect(() => {
    if (pending && complete.length > 0) {
      uploadRoomImage(roomAd.id, complete[complete.length - 1]);
    }
    if (complete.length === images.length) setPending(false);
  }, [complete, images, pending]);

  return (
    <div
      className={
        (containerClass && containerClass) + " w-full h-full flex flex-col"
      }
    >
      {!state.data && state.message && <p className="error">{state.message}</p>}
      <div className="w-full h-full flex flex-col py-2 px-10">
        <div
          id="image-container"
          className="w-96 p-6 aspect-video border-2 grid grid-cols-4 grid-rows-2"
        >
          {imagesUrls.map((url, index) => {
            return (
              <Image
                key={index}
                alt="Image"
                height={100}
                width={100}
                src={url}
                className="object-cover object-center w-full h-full"
              />
            );
          })}
          {imagesUrls.length <= 8 && (
            <button
              className="rounded-none w-full h-full"
              onClick={onAddClickHandler}
            >
              +
            </button>
          )}
        </div>
        <input
          className="input input-bordered rounded-sm mb-4 text-sm"
          type="file"
          id="image"
          name="image"
          hidden
          onChange={onChangeHandler}
          placeholder="Title"
          accept="image/*"
          required
        />
        <button
          className="btn mx-0 m-4  col-span-3"
          aria-disabled={pending}
          onClick={onSubmitHandler}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
