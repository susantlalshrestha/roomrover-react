"use client";

import { useCallback } from "react";
import { useFormStatus } from "react-dom";

type LogoutButtonProps = {
  className?: string | undefined;
  onclick: () => Promise<void> | void;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, onclick }) => {
  const { pending } = useFormStatus();

  const logout = useCallback(async () => {
    await onclick();
  }, []);

  return (
    <button
      className={`${className} btn`}
      type="button"
      onClick={logout}
      aria-disabled={pending}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
