"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@roomrover/app/(lib)/actions";
import { RegisterResponse } from "@roomrover/app/models";

type RegisterFormProps = Readonly<{}>;

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const router = useRouter();
  const [state, action] = useFormState<RegisterResponse, FormData>(register, {
    success: false,
  });

  useEffect(() => {
    if (state.success && state.data) {
      if (state.action && state.action === "verify-email") {
        router.replace(`/auth/verify-email?email=${state.data.email}`);
      } else {
        router.replace("/auth/login");
      }
    }
  }, [state]);

  return (
    <div className="w-full h-full flex flex-col">
      {!state.data && state.message && <p className="error">{state.message}</p>}
      <form action={action} className="w-full h-full flex flex-col py-8 px-10">
        <label className="form-label" htmlFor="first_name">
          Enter your first name.
        </label>
        <input
          className="form-input mb-4"
          type="text"
          id="first_name"
          name="first_name"
          required
        />
        <label className="form-label" htmlFor="last_name">
          Enter your last name.
        </label>
        <input
          className="form-input mb-4"
          type="text"
          id="last_name"
          name="last_name"
          required
        />
        <label className="form-label" htmlFor="email">
          Enter your email id.
        </label>
        <input
          className="form-input mb-4"
          type="email"
          id="email"
          name="email"
          required
        />
        <label className="form-label" htmlFor="phone_number">
          Enter your phone number.
        </label>
        <input
          className="form-input mb-4"
          type="tel"
          id="phone_number"
          name="phone_number"
          pattern="\d{3}[-\s]?\d{3}[-\s]?\d{4}"
          required
          title="Please enter a valid phone number (xxx-xxx-xxxx)"
        />
        <label className="form-label" htmlFor="password">
          Enter your password.
        </label>
        <input
          className="form-input mb-4"
          type="password"
          id="password"
          name="password"
          required
        />
        <label className="form-label" htmlFor="confirm_password">
          Enter your password again to make it sure.
        </label>
        <input
          className="form-input mb-4"
          type="password"
          id="confirm_password"
          name="confirm_password"
          required
        />
        <div className="flex">
          <label className="form-label flex-1 text-center" htmlFor="guest">
            <input type="radio" id="guest" name="role" value="GUEST" />
            <span className="inline-block mx-4">Guest</span>
          </label>
          <label className="form-label flex-1 text-center" htmlFor="host">
            <input type="radio" id="host" name="role" value="HOST" />
            <span className="inline-block mx-4">Host</span>
          </label>
        </div>
        <RegisterButton />
      </form>
    </div>
  );
};

const RegisterButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <button className="btn mx-0 m-4" type="submit" aria-disabled={pending}>
      Register
    </button>
  );
};

export default RegisterForm;
