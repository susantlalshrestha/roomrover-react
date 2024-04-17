"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CreateRoomAdResponse } from "@roomrover/app/models";
import { createRoomAd } from "@roomrover/app/(lib)/actions";
import { useEffect } from "react";

type CreateProps = Readonly<{}>;

const CreateForm: React.FC<CreateProps> = () => {
  const router = useRouter();
  const [state, action] = useFormState<CreateRoomAdResponse, FormData>(
    createRoomAd,
    { success: false }
  );

  useEffect(() => {
    if (state.success && state.data) {
      router.replace("/my-roomads");
      router.refresh();
    }
  }, [state]);

  return (
    <div className="w-full h-full flex flex-col">
      {!state.data && state.message && <p className="error">{state.message}</p>}
      <form action={action} className="w-full h-full flex flex-col py-8 px-10">
        <label className="form-label" htmlFor="title">
          Please enter the title of your ad
        </label>
        <input
          className="form-input mb-4"
          type="text"
          id="title"
          name="title"
          required
        />
        <label className="form-label" htmlFor="price">
          Enter the price
        </label>
        <input
          className="form-input mb-4"
          type="number"
          id="price"
          name="price"
          required
        />
        <label className="form-label" htmlFor="password">
          Enter the description. Must be atleast 10 characters.
        </label>
        <textarea
          className="form-input mb-4"
          id="description"
          name="description"
          rows={4}
          required
        />
        <CreateButton />
      </form>
    </div>
  );
};

const CreateButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <button className="btn mx-0 m-4" type="submit" aria-disabled={pending}>
      Create
    </button>
  );
};

export default CreateForm;
