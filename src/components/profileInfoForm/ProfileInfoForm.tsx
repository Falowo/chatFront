import React, { useRef } from "react";
import "./profileInfoForm.css";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import {
  selectCurrentUser,
  setEditInfoMode,
  updateCurrentUserInfoAsync,
} from "../../app/slices/currentUserSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { Relationship } from "../../interfaces";
export default function ProfileInfoForm() {
  const cityInputEl = useRef<any>(null);
  const fromInputEl = useRef<any>(null);
  const relationshipInputEl = useRef<any>(null);
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  return (
    <form
      className="profileInfoForm"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(
          updateCurrentUserInfoAsync({
            city: cityInputEl.current.value,
            from: fromInputEl.current.value,
            relationship: relationshipInputEl.current.value,
          }),
        );

        dispatch(setEditInfoMode(false));
      }}
    >
      <FormControl margin="dense" variant="outlined">
        <InputLabel htmlFor="city-input">City</InputLabel>
        <Input
          type="text"
          id="city-input"
          inputRef={cityInputEl}
          defaultValue={currentUser?.city}
          margin="dense"
        />
      </FormControl>
      <FormControl margin="dense" variant="outlined">
        <InputLabel htmlFor="from">From</InputLabel>
        <Input
          type="text"
          id="fromInput"
          inputRef={fromInputEl}
          defaultValue={currentUser?.from}
          margin="dense"
        />
      </FormControl>
      <FormControl
        sx={{ minWidth: "100%" }}
        margin="dense"
        variant="outlined"
      >
        <InputLabel id="relationshipSelect">
          Relationship
        </InputLabel>
        <Select
          id="relationshipSelect"
          labelId="relationshipSelect"
          inputRef={relationshipInputEl}
          defaultValue={currentUser?.relationship}
          label="Relationship"
        >
          <MenuItem value={undefined}> </MenuItem>
          <MenuItem value={Relationship.Single}>
            {Relationship[1]}
          </MenuItem>
          <MenuItem value={Relationship.Married}>
            {Relationship[2]}
          </MenuItem>
          <MenuItem value={Relationship.Private}>
            {Relationship[3]}
          </MenuItem>
        </Select>
      </FormControl>

      <Button
        className="buttonInfoForm"
        type="submit"
        variant="outlined"
      >
        Submit
      </Button>
    </form>
  );
}
