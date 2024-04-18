"use client";

import { RoomAd } from "@roomrover/app/models";
import { uploadRoomImage } from "@roomrover/app/(lib)/actions";
import { ChangeEvent, useCallback, useState } from "react";
import Image from "next/image";
import { storePhotos } from "@roomrover/app/(lib)/firebase";

type UploadProps = Readonly<{
  roomAd: RoomAd;
  className?: string;
}>;

const UploadForm: React.FC<UploadProps> = ({ className, roomAd }) => {
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState<string[]>(roomAd.images);
  const [images, setImages] = useState<Record<string, number>>(
    roomAd.images.reduce((a, c) => ({ ...a, [c]: 100 }), {})
  );

  const onAddClickHandler = useCallback(() => {
    (document.getElementById("image") as HTMLInputElement)?.click();
  }, [images]);

  const onChangeHandler = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        const fileName = `${roomAd.id}-${Date.now()}`;
        if (images[url]) return;
        setImages({ ...images, [url]: 0 });
        console.log(images);
        setPending(true);
        await storePhotos("roomads", file, fileName, {
          onChange(percentage) {
            console.log(url, percentage);
            setImages({ ...images, [url]: percentage });
          },
          onComplete(url) {
            setComplete(complete.concat([url]));
            setPending(false);
          },
          onError(error) {
            console.log(error);
            setPending(false);
          },
        });
      }
    },
    [images, complete, pending]
  );

  const onSubmitHandler = useCallback(async () => {
    if (!pending && complete.length > 0) {
      setPending(true);
      await uploadRoomImage(roomAd.id, complete);
      setPending(false);
    }
  }, [pending, complete]);

  return (
    <div className={(className && className) + " flex flex-col py-6 px-10"}>
      <div
        id="image-container"
        className="w-full p-4 aspect-video border-2 grid grid-cols-4 gap-1 grid-rows-2"
      >
        {Object.keys(images).map((url, index) => {
          return (
            <div key={index}>
              <Image
                alt="Image"
                height={100}
                width={100}
                src={url}
                className="object-cover object-center w-full h-full"
              />
              <progress
                className="progress"
                value={images[url]}
                max="100"
                hidden={images[url] === 100}
              />
            </div>
          );
        })}
        {Object.keys(images).length < 8 && (
          <button
            className="rounded-none w-full h-full"
            onClick={onAddClickHandler}
            aria-disabled={pending}
            disabled={pending}
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
        className="btn mx-0 m-4"
        aria-disabled={pending}
        disabled={pending}
        onClick={onSubmitHandler}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadForm;
