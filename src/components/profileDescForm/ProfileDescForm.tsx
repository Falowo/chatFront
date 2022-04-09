import React, { useRef } from "react";
import "./profileDescForm.css";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
} from "@mui/material";
import {
  selectCurrentUser,
  setEditDescMode,
  updateCurrentUserDescAsync,
} from "../../app/slices/currentUserSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

export default function ProfileDescForm() {
  const descInputEl = useRef<any>(null);

  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  return (
    <form
      className="descForm"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(
          updateCurrentUserDescAsync({
            desc: descInputEl.current.value,
          }),
        );
        dispatch(setEditDescMode(false));
      }}
    >
      <FormControl margin="dense" variant="outlined">
        <InputLabel htmlFor="desc-input">
          Description words ...
        </InputLabel>
        <Input
          type="text"
          id="city-input"
          inputRef={descInputEl}
          defaultValue={currentUser?.desc}
          margin="dense"
        />
      </FormControl>

      <Button
        className="descFormButton"
        type="submit"
        variant="outlined"
        color="primary"
      >
        Submit
      </Button>
    </form>
  );
}
