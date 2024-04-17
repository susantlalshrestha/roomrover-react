"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  resendVerificationCode,
  verifyEmail,
} from "@roomrover/app/(lib)/actions";
import { VerifyEmailResponse } from "@roomrover/app/models";

type FormProps = Readonly<{}>;

const VerifyEmailForm: React.FC<FormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [state, action] = useFormState<VerifyEmailResponse, FormData>(
    verifyEmail,
    { success: false }
  );

  useEffect(() => {
    console.log("v" + email);

    // if (!email) router.replace("/auth/login");
  }, [email]);

  useEffect(() => {
    if (state.success) {
      if (state.data) {
        router.replace(`/auth/login?email=${state.data.email}`);
      } else {
        router.replace("/auth/login");
      }
    }
  }, [state]);

  const resendCode = useCallback(async () => {
    if (email) {
      await resendVerificationCode(email);
    }
  }, [email]);

  return (
    <div className="w-full h-full flex flex-col py-8 px-10">
      {!state.data && state.message && <p className="error">{state.message}</p>}
      <form action={action} className="w-full h-full flex flex-col">
        <label className="form-label" htmlFor="email">
          What is your email id?
        </label>
        <input
          className="form-input mb-4"
          type="email"
          id="email"
          name="email"
          value={email ? email : ""}
          readOnly
          required
        />
        <label className="form-label" htmlFor="otp">
          Enter your otp here.
        </label>
        <input
          className="form-input mb-4"
          type="number"
          id="otp"
          name="otp"
          required
        />
        <SubmitButton />
        <ResendCodeButton onclick={resendCode} />
      </form>
    </div>
  );
};

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <button className="btn mx-0 m-4" type="submit" aria-disabled={pending}>
      VerifyEmail
    </button>
  );
};

const ResendCodeButton: React.FC<{ onclick: () => void }> = ({ onclick }) => {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn mx-0 m-4"
      type="button"
      onClick={onclick}
      aria-disabled={pending}
    >
      ResendCode
    </button>
  );
};

export default VerifyEmailForm;
