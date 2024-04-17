// "use client";
import { auth, AuthUser } from "../../../auth";
import { getFilterdRooms } from "../(lib)/actions";
import { GetRoomsResponse } from "../models";
import { useFormState } from "react-dom";

type Props = {
  containerClass?: string;
};

const SearchBar: React.FC<Props> = async ({ containerClass }) => {
  const authdata = await auth();
  let user: AuthUser | undefined = undefined;
  if (authdata && authdata.user) {
    user = authdata.user as AuthUser;
  }
  // const [state, action] = useFormState<GetRoomsResponse, FormData>(
  //   getFilterdRooms,
  //   { success: false }
  // );

  return (
    <div className={containerClass}>
      <form
        // action={action}
        className="w-1/2 backdrop-blur-xl bg-white/30 shadow-md rounded-full flex divide-x text-sm"
      >
        <ul className="w-full backdrop-blur-xl bg-white/30 shadow-md rounded-full flex divide-x text-sm">
          <li className="flex-1 text-center rounded-l-full">
            <input
              type="number"
              id="fromPrice"
              name="fromPrice"
              className="form-input p-4 w-full h-full rounded-l-full"
              placeholder="From Price"
            />
          </li>
          <li className="flex-1 text-center rounded-r-full">
            <input
              type="number"
              id="toPrice"
              name="toPrice"
              className="form-input p-4 w-full h-full"
              placeholder="To Price"
            />
          </li>
          <li className="flex-1 p-4 text-center rounded-r-full">
            <button type="submit">Filter</button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default SearchBar;
