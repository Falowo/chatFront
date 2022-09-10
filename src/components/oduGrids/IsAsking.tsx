import React from "react";
import { Grid } from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  castOdu,
  selectQuestion,
} from "../../app/slices/ifaSlice";

export default function IsAsking() {
  const dispatch = useAppDispatch();
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
        <Grid
          item
          xs={1}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
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
        {/* between the two odu */}
        <Grid item xs={1}></Grid>
        {/* first odu leg1*/}
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
        {/* firstOdu leg0 */}
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

        {/* new row */}
        <Grid item xs={3.5}></Grid>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!!question?.secondOdu?.oduNames?.length && (
            <span
              className="oduQuestion"
              style={{
                color: !!question?.secondOdu?.randomColor
                  ? `${
                      "#" + question?.secondOdu?.randomColor
                    }`
                  : "white",
              }}
            >
              {!!question?.secondOdu?.oduNames?.length &&
                question?.secondOdu?.oduNames[0]}
            </span>
          )}
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!!question?.firstOdu?.oduNames?.length && (
            <span
              className="oduQuestion"
              style={{
                color: !!question?.firstOdu?.randomColor
                  ? `${
                      "#" + question?.firstOdu?.randomColor
                    }`
                  : "white",
              }}
            >
              {!!question?.firstOdu?.oduNames?.length &&
                question?.firstOdu?.oduNames[0]}
            </span>
          )}
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
      </Grid>
    </div>
  );
}
