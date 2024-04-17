import React from "react";
import { auth, AuthUser } from "../../../auth";

type Props = { containerClass?: string };

const SearchBar: React.FC<Props> = async ({ containerClass }) => {
  const authdata = await auth();
  let user: AuthUser | undefined = undefined;
  if (authdata && authdata.user) {
    user = authdata.user as AuthUser;
  }

  return (
    <div className={containerClass}>
      <ul className="w-1/2 backdrop-blur-xl bg-white/30 shadow-md rounded-full flex divide-x text-sm">
        <li className="flex-1 p-4 text-center rounded-l-full">From Price</li>
        <li className="flex-1 p-4 text-center rounded-r-full">To Price</li>
        <li className="flex-1 p-4 text-center rounded-r-full">Filter</li>
      </ul>
    </div>
  );
};

export default SearchBar;
