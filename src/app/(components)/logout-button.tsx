"use client";

import { useCallback } from "react";
import { useFormStatus } from "react-dom";

type LogoutButtonProps = {
  className?: string | undefined;
  onClick: () => Promise<void> | void;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, onClick }) => {
  const { pending } = useFormStatus();

  const logout = useCallback(async () => {
    await onClick();
  }, []);

  return (
    <button
      className={className}
      type="button"
      onClick={logout}
      aria-disabled={pending}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
