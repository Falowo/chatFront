import { useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./friendRequests.css";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import UserSearchElt from "../../components/userSearchElt/UserSearchElt";
import { checkExp } from "../../app/slices/authSlice";
import { selectFriendRequestsFrom } from "../../app/slices/currentUserSlice";

const Search = () => {
  const usersRequestingFriendship = useAppSelector(
    selectFriendRequestsFrom,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkExp());
  }, [dispatch]);
  return (
    <>
      <Topbar />
      <div className="searchContainer">
        <Sidebar />
        <div className="search">
          {!!usersRequestingFriendship.length &&
            usersRequestingFriendship.map((u) => (
              <UserSearchElt
                user={{ ...u, _id: u._id! }}
                key={u._id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Search;
