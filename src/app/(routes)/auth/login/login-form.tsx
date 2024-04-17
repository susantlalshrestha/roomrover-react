"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LoginResponse } from "@roomrover/app/models";
import { authenticate } from "@roomrover/app/(lib)/actions";

type LoginFormProps = Readonly<{}>;

const LoginForm: React.FC<LoginFormProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>(searchParams.get("email") || "");
  const [state, action] = useFormState<LoginResponse, FormData>(authenticate, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      router.replace("/home");
    }
  }, [state]);

  return (
    <div className="w-full h-full flex flex-col">
      {!state.data &&
        state.message &&
        (state.action && state.action === "verify-account" ? (
          <Link
            href={{ pathname: `/auth/verify-email`, query: { email } }}
            passHref
            className="error underline"
          >
            {state.message}
          </Link>
        ) : (
          <p className="error">{state.message}</p>
        ))}
      <form action={action} className="w-full h-full flex flex-col py-8 px-10">
        <label className="form-label" htmlFor="email">
          What is your email id?
        </label>
        <input
          className="form-input mb-4"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
        <LoginButton />
      </form>
    </div>
  );
};

const LoginButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <button className="btn mx-0 m-4" type="submit" aria-disabled={pending}>
      Login
    </button>
  );
};

export default LoginForm;
