import { useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./search.css";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import { selectSearchUsers } from "../../app/slices/searchSlice";
import UserSearchElt from "../../components/userSearchElt/UserSearchElt";
import { checkExp } from "../../app/slices/authSlice";

const Search = () => {
  const searchUsers = useAppSelector(selectSearchUsers);
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
          {!!searchUsers.length &&
            searchUsers.map((u) => (
              <UserSearchElt user={u} key={u._id} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Search;
