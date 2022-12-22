import React, { useState } from "react";
import "./oponIfa.css";
import OponIfaImage from "../../components/sidebar/square-opon-ifa-black.jpg";
import { Box } from "@mui/material";
import {
  Cached,
  QuestionMark,
  PlayArrow,
  SkipPrevious,
  SkipNext,
  MeetingRoom,
} from "@mui/icons-material";
import { Input } from "@mui/material";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  askQuestionAsync,
  blankTrail,
  castOdu,
  decrementIndexCurrentOdu,
  decrementIndexCurrentQuestion,
  incrementIndexCurrentOdu,
  incrementIndexCurrentQuestion,
  // selectCurrentOdu,
  selectIndexCurrentOdu,
  selectOduHistory,
} from "../../app/slices/ifaSlice";
import IsNotAsking from "../../components/oduGrids/IsNotAsking";
import IsAsking from "../../components/oduGrids/IsAsking";

export default function OponIfa() {
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  // const currentOdu = useAppSelector(selectCurrentOdu);
  const indexCurrentOdu = useAppSelector(
    selectIndexCurrentOdu,
  );
  const oduHistory = useAppSelector(selectOduHistory);
  let currentOdu = oduHistory[indexCurrentOdu];
  return (
    <Box
      sx={{
        width: "64vw",
        height: "100vh",
        margin: "0 auto !important",
        padding: "0 auto !important",
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "row-reverse",
          justifyContent: "space-between",
          padding: "5px",
          alignItems: "center",
        }}
      >
        {!isAsking ? (
          <QuestionMark
            onClick={(e) => {
              e.stopPropagation();
              setIsAsking(true);
            }}
            sx={{
              fontSize: "3rem",
              fontWeight: "bolder",
              cursor: "pointer",
              margin: "16px",
              minWidth: "64px",
              minHeight: "64px",
            }}
          />
        ) : (
          <MeetingRoom
            onClick={(e) => {
              e.stopPropagation();
              setIsAsking(false);
            }}
            sx={{
              fontSize: "3rem",
              fontWeight: "bolder",
              cursor: "pointer",
              margin: "16px",
              minWidth: "64px",
              minHeight: "64px",
            }}
          />
        )}
        {
          <PlayArrow
            onClick={(e) => {
              e.stopPropagation();
              if (!isAsking) {
                dispatch(castOdu());
              } else {
                dispatch(askQuestionAsync({ ibo: true }));
              }
            }}
            sx={{
              fontSize: "3rem",
              fontWeight: "bolder",
              cursor: "pointer",
              margin: "16px",
              minWidth: "64px",
              minHeight: "64px",
            }}
          />
        }

        {!isAsking ? (
          <h1
            className="oduNameTitle"
            style={{
              textAlign: "center",
              color: `${
                !!currentOdu?.randomColor
                  ? "#" + currentOdu.randomColor
                  : "white"
              }`,
            }}
          >
            {!!currentOdu?.oduNames?.length
              ? currentOdu?.oduNames[0]
              : `e-opele`}
          </h1>
        ) : (
          <Input
            sx={{
              flexGrow: "1",
            }}
            autoFocus={true}
            placeholder="Write your binary question or formalize it"
          />
        )}
        <div style={{ minWidth: "64px" }}>
          {!!currentOdu &&
            currentOdu.leg0.length === 4 &&
            currentOdu.leg1.length === 4 && (
              <Cached
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(blankTrail());
                }}
                sx={{
                  fontSize: "3rem",
                  fontWeight: "bolder",
                  cursor: "pointer",
                  margin: "16px",
                  minWidth: "64px",
                  minHeight: "64px",
                }}
              />
            )}
          {
            <>
              <SkipPrevious
                onClick={(e) => {
                  e.stopPropagation();
                  if (!!isAsking) {
                    dispatch(
                      incrementIndexCurrentQuestion(),
                    );
                  } else {
                    dispatch(incrementIndexCurrentOdu());
                  }
                }}
                sx={{
                  fontSize: "3rem",
                  fontWeight: "bolder",
                  cursor: "pointer",
                  margin: "16px",
                  minWidth: "64px",
                  minHeight: "64px",
                }}
              />
              <SkipNext
                onClick={(e) => {
                  e.stopPropagation();
                  if (!!isAsking) {
                    dispatch(
                      decrementIndexCurrentQuestion(),
                    );
                  } else {
                    dispatch(decrementIndexCurrentOdu());
                  }
                }}
                sx={{
                  fontSize: "3rem",
                  fontWeight: "bolder",
                  cursor: "pointer",
                  margin: "16px",
                  minWidth: "64px",
                  minHeight: "64px",
                }}
              />
            </>
          }
        </div>
      </div>

      <>
        <div
          className="divImageOpon"
          onClick={() => {
            if (!isAsking) {
              dispatch(castOdu());
            } else {
              dispatch(askQuestionAsync({ ibo: true }));
            }
          }}
        >
          <img
            className="imageOpon"
            src={OponIfaImage}
            alt="Opon Ifa"
          />
        </div>

        {!isAsking ? <IsNotAsking /> : <IsAsking />}
      </>
    </Box>
  );
}
