"use client";

import { useFormState, useFormStatus } from "react-dom";
import { RoomAd, UpdateRoomAdResponse } from "@roomrover/app/models";
import { updateRoomAd } from "@roomrover/app/(lib)/actions";
import { useState } from "react";

type UpdateProps = Readonly<{
  roomAd: RoomAd;
  className?: string;
}>;

const UpdateForm: React.FC<UpdateProps> = ({ className, roomAd }) => {
  const [title, setTitle] = useState<string>(roomAd.title);
  const [price, setPrice] = useState<string>(roomAd.price + "");
  const [description, setDescription] = useState<string>(roomAd.description);
  const [state, action] = useFormState<UpdateRoomAdResponse, FormData>(
    updateRoomAd,
    { success: false }
  );

  return (
    <form
      action={action}
      className={(className && className) + " flex flex-col py-6 px-10"}
    >
      <label className="input input-bordered flex items-center gap-2 rounded-sm mb-4 text-sm">
        # ID:
        <input
          className="grow"
          type="text"
          id="id"
          name="id"
          placeholder="ID"
          value={roomAd.id}
          readOnly
          required
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 rounded-sm mb-4 text-sm">
        Title:
        <input
          className="grow"
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 rounded-sm mb-4 text-sm">
        Price:
        <input
          className="grow"
          type="number"
          id="price"
          name="price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <textarea
        className="input flex-1 input-bordered rounded-sm mb-4 p-4 min-h-56 text-sm"
        id="description"
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <UpdateButton />
    </form>
  );
};

const UpdateButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn mx-0 m-4  col-span-3"
      type="submit"
      aria-disabled={pending}
    >
      Update
    </button>
  );
};

export default UpdateForm;
