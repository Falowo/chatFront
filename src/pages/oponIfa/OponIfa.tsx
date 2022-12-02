import React, { useState } from "react";
import "./oponIfa.css";
import OponIfaImage from "../../components/sidebar/square-opon-ifa-black.jpg";
import { Box } from "@mui/material";
import {
  Cached,
  QuestionMark,
  PlayArrow,
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
  selectCurrentOdu,
} from "../../app/slices/ifaSlice";
import IsNotAsking from "../../components/oduGrids/IsNotAsking";
import IsAsking from "../../components/oduGrids/IsAsking";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import FastRewindIcon from "@mui/icons-material/FastRewind";
export default function OponIfa() {
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const currentOdu = useAppSelector(selectCurrentOdu);

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
          <MeetingRoomIcon
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
                !!currentOdu.randomColor
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
             { (  <FastRewindIcon
            onClick={(e) => {
              e.stopPropagation();
              console.log("FastRewindIcon");
            }}
            sx={{
              fontSize: "3rem",
              fontWeight: "bolder",
              cursor: "pointer",
              margin: "16px",
              minWidth: "64px",
              minHeight: "64px",
            }}
          />)}
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
