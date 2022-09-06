import React, { useEffect } from "react";
import "./oponIfa.css";
import OponIfaImage from "../../components/sidebar/square-opon-ifa-black.jpg";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  castOdu,
  Mark,
  modifyCurrentOdu,
  selectCurrentOdu,
  selectOduHistory,
} from "../../app/slices/ifaSlice";
import * as timeago from "timeago.js";

export default function OponIfa() {
  const dispatch = useAppDispatch();
  const currentOdu = useAppSelector(selectCurrentOdu);
  const oduHistory = useAppSelector(selectOduHistory);
  const textShadow = "-4px 1px #002021";

  return (
    <Box
      sx={{
        width: "64vw",
        height: "100vh",
        margin: "0 auto !important",
        padding: "0 auto !important",
      }}
    >
      <h1
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
      <>
        <div
          className="divImageOpon"
          onClick={() => dispatch(castOdu())}
        >
          <img
            className="imageOpon"
            src={OponIfaImage}
            alt="Opon Ifa"
          />
        </div>

        <Grid
          className="printGrid"
          container
          spacing={1}
          margin="0 auto"
          width="100%"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(castOdu());
          }}
        >
          <Grid xs={4.5}></Grid>
          <Grid item xs={1.5}>
            {/* <div style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: true,
                  indexOfLeg: 0,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,
                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg1[0] === true ? "I" : "II"}
            </h2>


            </div> */}

            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: true,
                  indexOfLeg: 0,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,
                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg1[0] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid item xs={1.5}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: false,
                  indexOfLeg: 0,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,

                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg0[0] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid item xs={4.5}></Grid>
          <Grid item xs={4.5}></Grid>

          <Grid item xs={1.5}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: true,
                  indexOfLeg: 1,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,

                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg1[1] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid item xs={1.5}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: false,
                  indexOfLeg: 1,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,

                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg0[1] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid xs={4.5}></Grid>
          <Grid item xs={4.5}></Grid>
          <Grid item xs={1.5}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: true,
                  indexOfLeg: 2,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,

                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg1[2] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid item xs={1.5}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: false,
                  indexOfLeg: 2,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,

                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg0[2] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid item xs={4.5}></Grid>
          <Grid item xs={4.5}></Grid>
          <Grid item xs={1.5}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: true,
                  indexOfLeg: 3,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,

                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg1[3] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid item xs={1.5}>
            <h2
              onClick={(e) => {
                e.stopPropagation();
                const mark: Mark = {
                  legEntry: false,
                  indexOfLeg: 3,
                };
                const payload = { mark, currentOdu };
                dispatch(modifyCurrentOdu(payload));
              }}
              className="markItem"
              style={{
                textShadow,
                color: !!currentOdu.randomColor
                  ? `${"#" + currentOdu.randomColor}`
                  : "white",
              }}
            >
              {currentOdu.leg0[3] === true ? "I" : "II"}
            </h2>
          </Grid>
          <Grid item xs={4.5}></Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <div>
              <div className="oduHistoryList">
                {!!oduHistory &&
                  !!oduHistory?.length &&
                  oduHistory
                    .filter(
                      (o) =>
                        oduHistory.indexOf(o) < 8 &&
                        oduHistory.indexOf(o) !== 0,
                    )
                    .map((o) => {
                      return (
                        <>
                          <li
                            className="oduHistoryListItems"
                            style={{
                              color: !!o.randomColor
                                ? `${"#" + o.randomColor}`
                                : "white",
                            }}
                          >
                            {!!o?.oduNames?.length &&
                              o.oduNames[0]}
                          </li>
                          <span
                            className="spanTimeAgo"
                            style={{
                              color: !!o.randomColor
                                ? `${"#" + o.randomColor}`
                                : "white",
                            }}
                          >
                            {!!o.createdAt &&
                              timeago.format(o.createdAt)}
                          </span>
                        </>
                      );
                    })}
              </div>
            </div>
          </Grid>
        </Grid>
      </>
    </Box>
  );
}
