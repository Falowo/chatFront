import React, { useState } from "react";
import "./oponIfa.css";
import OponIfaImage from "../../components/sidebar/square-opon-ifa-black.jpg";
import { Box } from "@mui/material";
import { Cached, QuestionMark } from "@mui/icons-material";
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
        <QuestionMark
          onClick={() => {
            setIsAsking(true);
            dispatch(askQuestionAsync({ ibo: true }));
          }}
          sx={{
            fontSize: "3rem",
            fontWeight: "bolder",
            cursor: "pointer",
          }}
        />
   
        {!isAsking && (
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
              : `Opele mi`}
          </h1>
        )}
             {currentOdu &&
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
              }}
            />
          )}
        
      </div>

      <>
        <div
          className="divImageOpon"
          onClick={() => {
            setIsAsking(false);
            dispatch(castOdu());
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
