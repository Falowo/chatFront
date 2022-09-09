import React from "react";
import { Grid } from "@mui/material";
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

export default function IsNotAsking() {
  const dispatch = useAppDispatch();
  const currentOdu = useAppSelector(selectCurrentOdu);
  const oduHistory = useAppSelector(selectOduHistory);
  const textShadow = "-4px 1px #002021";

  return (
    <div>
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
        <Grid item xs={4.5}></Grid>
        <Grid item xs={1.5}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {!!currentOdu &&
              currentOdu?.leg1?.map(
                (m: boolean, i: number) => (
                  <h2
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      const mark: Mark = {
                        legEntry: true,
                        indexOfLeg: i,
                      };
                      const payload = {
                        mark,
                        currentOdu,
                      };
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
                    {m === true ? "I" : "II"}
                  </h2>
                ),
              )}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {!!currentOdu &&
              currentOdu.leg0?.map((m, i) => (
                <h2
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    const mark: Mark = {
                      legEntry: false,
                      indexOfLeg: i,
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
                  {m === true ? "I" : "II"}
                </h2>
              ))}
          </div>
        </Grid>

        <Grid item xs={4.5}></Grid>

        <Grid item xs={8}></Grid>
        <Grid item xs={4}>
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
                        key={oduHistory.indexOf(o)}
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
        </Grid>
      </Grid>
    </div>
  );
}
