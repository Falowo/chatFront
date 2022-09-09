import React from "react";
import { Grid } from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  castOdu,
  selectOduHistory,
  selectQuestion,
} from "../../app/slices/ifaSlice";
import * as timeago from "timeago.js";

export default function IsAsking() {
  const dispatch = useAppDispatch();
  const oduHistory = useAppSelector(selectOduHistory);
  const question = useAppSelector(selectQuestion);
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
        <Grid item xs={3.5}></Grid>
        {/*question secondOdu */}
        {/* leg1 */}
        <Grid item xs={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {!!question &&
              question?.secondOdu &&
              question?.secondOdu?.leg1?.map(
                (m: boolean, i: number) => (
                  <h2
                    key={i}
                    className="markItem"
                    style={{
                      textShadow,
                      color: !!question?.secondOdu
                        ?.randomColor
                        ? `${
                            "#" +
                            question?.secondOdu?.randomColor
                          }`
                        : "white",
                    }}
                  >
                    {m === true ? "I" : "II"}
                  </h2>
                ),
              )}
          </div>
        </Grid>
        <Grid item xs={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {!!question &&
              question?.secondOdu &&
              question?.secondOdu?.leg0?.map((m, i) => (
                <h2
                  key={i}
                  className="markItem"
                  style={{
                    textShadow,
                    color: !!question?.secondOdu
                      ?.randomColor
                      ? `${
                          "#" +
                          question?.secondOdu?.randomColor
                        }`
                      : "white",
                  }}
                >
                  {m === true ? "I" : "II"}
                </h2>
              ))}
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {!!question &&
              question?.firstOdu?.leg1?.map(
                (m: boolean, i: number) => (
                  <h2
                    key={i}
                    className="markItem"
                    style={{
                      textShadow,
                      color: !!question.firstOdu.randomColor
                        ? `${
                            "#" +
                            question.firstOdu.randomColor
                          }`
                        : "white",
                    }}
                  >
                    {m === true ? "I" : "II"}
                  </h2>
                ),
              )}
          </div>
        </Grid>
        <Grid item xs={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {!!question &&
              question?.firstOdu?.leg0?.map((m, i) => (
                <h2
                  key={i}
                  className="markItem"
                  style={{
                    textShadow,
                    color: !!question.firstOdu.randomColor
                      ? `${
                          "#" +
                          question.firstOdu.randomColor
                        }`
                      : "white",
                  }}
                >
                  {m === true ? "I" : "II"}
                </h2>
              ))}
          </div>
        </Grid>

        <Grid item xs={3.5}></Grid>

        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          {typeof question?.response === "boolean" && (
            <h1
              style={{
                textAlign: "center",
                fontSize: "3rem",
                fontWeight: "bold",
              }}
            >
              {question?.response?.toString()}
            </h1>
          )}
        </Grid>
        <Grid item xs={4}>
          <div className="oduHistoryList">
            {!!oduHistory &&
              !!oduHistory?.length &&
              oduHistory
                .filter((o) => oduHistory.indexOf(o) <= 1)
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
                      
                    </>
                  );
                })}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
