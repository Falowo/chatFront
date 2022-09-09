import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkDispatch,
  //   PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../store";

import { toast } from "react-toastify";

const position = {
  position: toast.POSITION.BOTTOM_RIGHT,
};

export interface Mark {
  legEntry: boolean;
  indexOfLeg: number;
}

export enum LegName {
  ogbe = "Ogbè",
  oyeku = "Ọ̀yẹ̀kú",
  iwori = "Ìwòrì",
  odi = "Òdí",
  irosun = "Ìrosùn",
  owonrin = "Ọ̀wọ́nrín",
  obara = "Ọ̀bàrà",
  okanran = "Ọ̀kànràn",
  ogunda = "Ògúndá",
  osa = "Ọ̀sá",
  ika = "Ìká",
  oturupon = "Òtúúrúpọ̀n",
  otura = "Òtúrá",
  irete = "Ìrẹ̀tẹ̀ ",
  ose = "Ọ̀ṣẹ́ ",
  ofun = "Òfún",
}

export interface OduItem {
  leg0: boolean[];
  leg1: boolean[];
  nameLeg0?: LegName;
  nameLeg1?: LegName;
  oduNames?: string[];
  randomColor?: string;
  createdAt?: string;
}

export interface Question {
  question?: string;
  firstOdu: OduItem;
  secondOdu?: OduItem;
  response: boolean;
}

export interface IfaCity {
  current: OduItem;
  question?: Question;
  history: OduItem[];
  isFetching: boolean;
}

const initialState: IfaCity = {
  current: {
    leg0: [],
    leg1: [],

    nameLeg0: undefined,
    nameLeg1: undefined,
    oduNames: [],
    createdAt: undefined,
  },
  history: [],
  isFetching: false,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

const getLegName = (leg: boolean[]): LegName => {
  if (
    leg[0] === true &&
    leg[1] === true &&
    leg[2] === true &&
    leg[3] === true
  ) {
    return LegName.ogbe;
  } else if (
    leg[0] === false &&
    leg[1] === false &&
    leg[2] === false &&
    leg[3] === false
  ) {
    return LegName.oyeku;
  } else if (
    leg[0] === false &&
    leg[1] === true &&
    leg[2] === true &&
    leg[3] === false
  ) {
    return LegName.iwori;
  } else if (
    leg[0] === true &&
    leg[1] === false &&
    leg[2] === false &&
    leg[3] === true
  ) {
    return LegName.odi;
  } else if (
    leg[0] === true &&
    leg[1] === true &&
    leg[2] === false &&
    leg[3] === false
  ) {
    return LegName.irosun;
  } else if (
    leg[0] === false &&
    leg[1] === false &&
    leg[2] === true &&
    leg[3] === true
  ) {
    return LegName.owonrin;
  } else if (
    leg[0] === true &&
    leg[1] === false &&
    leg[2] === false &&
    leg[3] === false
  ) {
    return LegName.obara;
  } else if (
    leg[0] === false &&
    leg[1] === false &&
    leg[2] === false &&
    leg[3] === true
  ) {
    return LegName.okanran;
  } else if (
    leg[0] === true &&
    leg[1] === true &&
    leg[2] === true &&
    leg[3] === false
  ) {
    return LegName.ogunda;
  } else if (
    leg[0] === false &&
    leg[1] === true &&
    leg[2] === true &&
    leg[3] === true
  ) {
    return LegName.osa;
  } else if (
    leg[0] === false &&
    leg[1] === true &&
    leg[2] === false &&
    leg[3] === false
  ) {
    return LegName.ika;
  } else if (
    leg[0] === false &&
    leg[1] === false &&
    leg[2] === true &&
    leg[3] === false
  ) {
    return LegName.oturupon;
  } else if (
    leg[0] === true &&
    leg[1] === false &&
    leg[2] === true &&
    leg[3] === true
  ) {
    return LegName.otura;
  } else if (
    leg[0] === true &&
    leg[1] === true &&
    leg[2] === false &&
    leg[3] === true
  ) {
    return LegName.irete;
  } else if (
    leg[0] === true &&
    leg[1] === false &&
    leg[2] === true &&
    leg[3] === false
  ) {
    return LegName.ose;
  } else if (
    leg[0] === false &&
    leg[1] === true &&
    leg[2] === false &&
    leg[3] === true
  ) {
    return LegName.ofun;
  } else {
    console.log(leg);
    return LegName.ogbe;
  }
};

const nameOdu = (
  leg0: boolean[],
  leg1: boolean[],
): string => {
  const nameLeg0 = getLegName(leg0);
  const nameLeg1 = getLegName(leg1);
  let oduName: string;
  console.log({ leg0, leg1, nameLeg0, nameLeg1 });

  if (nameLeg0 === nameLeg1) {
    if (nameLeg0 === LegName.ogbe) {
      oduName = "Èjìogbè";
    } else if (nameLeg0 === LegName.ofun) {
      oduName = "Ọ̀ràngún";
    } else {
      oduName = `${nameLeg0} méjì`;
    }
  } else {
    oduName = `${nameLeg0} ${nameLeg1}`;
  }

  return oduName;
};

export const searchRoomAsync = createAsyncThunk<
  OduItem,
  {
    current: OduItem;
  },
  { state: RootState }
>("ifa/searchRoom", async (props: { current: OduItem }) => {
  const { current } = props;

  return current;
});

export const askQuestionAsync = createAsyncThunk<
  Question,
  { ibo: boolean; question?: string },
  {
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>;
    state: RootState;
  }
>(
  "ifa/askQuestion",
  async (
    props: { ibo: boolean; question?: string },
    { dispatch, getState },
  ) => {
    const { ibo, question } = props;
    await dispatch(castOdu());
    const firstOdu: OduItem = selectCurrentOdu(getState());
    let secondOdu: OduItem;
    if (
      // Ejiogbe
      JSON.stringify(firstOdu.leg0) ===
        JSON.stringify([true, true, true, true]) &&
      JSON.stringify(firstOdu.leg1) ===
        JSON.stringify([true, true, true, true])
    ) {
      const payload: Question = {
        response: !!ibo,
        question,
        firstOdu,
      };
      return payload;
    } else if (
      // orangun
      JSON.stringify(firstOdu.leg0) ===
        JSON.stringify([false, true, false, true]) &&
      JSON.stringify(firstOdu.leg1) ===
        JSON.stringify([false, true, false, true])
    ) {
      const payload: Question = {
        response: !!ibo,
        question,
        firstOdu,
      };
      return payload;
    } else {
      // throw second time
      await dispatch(castOdu());
      secondOdu = selectCurrentOdu(getState());

      if (
        // first odu is oju odu only
        JSON.stringify(firstOdu.leg0) ===
          JSON.stringify(firstOdu.leg1) &&
        (!secondOdu ||
          JSON.stringify(secondOdu?.leg0) !==
            JSON.stringify(secondOdu?.leg1))
      ) {
        const payload: Question = {
          response: !!ibo,
          question,
          firstOdu,
          secondOdu,
        };
        return payload;
      } else if (
        // secondOdu is oju odu only
        !!secondOdu &&
        JSON.stringify(secondOdu?.leg0) ===
          JSON.stringify(secondOdu?.leg1) &&
        JSON.stringify(firstOdu?.leg0) !==
          JSON.stringify(firstOdu?.leg1)
      ) {
        const payload: Question = {
          response: !ibo,
          question,
          firstOdu,
          secondOdu,
        };
        return payload;
        // both odu are oju odu or both are not oju odu
      } else {
        const firstOduLegsName: LegName = getLegName(
          firstOdu.leg0,
        );
        const secondOduLegsName: LegName = getLegName(
          secondOdu.leg0,
        );
        const indexOfFirst: number = Object.values(
          LegName,
        ).indexOf(firstOduLegsName);
        const indexOfSecond: number = Object.values(
          LegName,
        ).indexOf(secondOduLegsName);

        console.log({ indexOfFirst, indexOfSecond });

        if (indexOfFirst <= indexOfSecond) {
          const payload: Question = {
            response: !!ibo,
            question,
            firstOdu,
            secondOdu,
          };
          return payload;
        } else {
          const payload: Question = {
            response: !ibo,
            question,
            firstOdu,
            secondOdu,
          };
          return payload;
        }
      }
    }
  },
);

export const ifaSlice = createSlice({
  name: "ifa",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    castOdu: (state) => {
      const leg0: [boolean, boolean, boolean, boolean] = [
        !!Math.round(Math.random()),
        !!Math.round(Math.random()),
        !!Math.round(Math.random()),
        !!Math.round(Math.random()),
      ];

      const leg1: [boolean, boolean, boolean, boolean] = [
        !!Math.round(Math.random()),
        !!Math.round(Math.random()),
        !!Math.round(Math.random()),
        !!Math.round(Math.random()),
      ];

      state.current = {
        leg0,
        leg1,
      };

      if (!state.current.oduNames?.length) {
        const nameLeg0 = getLegName(leg0);
        const nameLeg1 = getLegName(leg1);
        console.log({ leg0, leg1, nameLeg0, nameLeg1 });

        const oduName: string = nameOdu(leg0, leg1);

        const oduNames = [oduName];

        let randomValue = 0.48 + Math.random() / 4;

        const randomColor = Math.floor(
          randomValue * 16777215,
        ).toString(16);
        const createdAt = new Date().toString();

        state.current = {
          ...state.current,
          nameLeg0,
          nameLeg1,
          oduNames,
          randomColor,
          createdAt,
        };
      }

      state.history = [state.current, ...state.history];
      if (state.history?.length > 16) {
        state.history = state.history.filter(
          (o) => state.history.indexOf(o) < 16,
        );
      }
    },
    blankTrail: (state) => {
      state.current = initialState.current;
      state.history = initialState.history;
      state.question = initialState.question;
    },
    modifyCurrentOdu: (
      state,
      action: PayloadAction<{
        mark: Mark;
        currentOdu: OduItem;
      }>,
    ) => {
      if (action.payload) {
        const { mark } = action.payload;

        const { legEntry, indexOfLeg } = mark;

        if (legEntry === false) {
          state.current = {
            ...state.current,
            leg0: state.current.leg0.map((m, i) => {
              if (i === indexOfLeg) {
                return !m;
              } else return !!m;
            }),
          };
        } else if (legEntry === true) {
          state.current = {
            ...state.current,
            leg1: state.current.leg1.map((m, i) => {
              if (i === indexOfLeg) {
                return !m;
              } else return !!m;
            }),
          };
        }

        const oduName = nameOdu(
          state.current.leg0,
          state.current.leg1,
        );

        state.current = {
          ...state.current,
          oduNames: [oduName],
        };

        state.history = [state.current, ...state.history];
        if (state.history?.length > 16) {
          state.history = state.history.filter(
            (o) => state.history.indexOf(o) < 16,
          );
        }
      }
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(searchRoomAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        searchRoomAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.current = action.payload;
          }
        },
      )
      .addCase(
        searchRoomAsync.rejected,
        (state, action) => {
          console.log(action);

          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(askQuestionAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        askQuestionAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            const question: Question = action.payload;
            state.question = { ...question };
          }
        },
      )
      .addCase(
        askQuestionAsync.rejected,
        (state, action) => {
          console.log(action);

          state.isFetching = false;
          toast(action.error.message, position);
        },
      );
  },
});

export const { castOdu, blankTrail, modifyCurrentOdu } =
  ifaSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectCurrentOdu = (state: RootState) =>
  state.ifa.current;
export const selectOduHistory = (state: RootState) =>
  state.ifa.history;
export const selectQuestion = (state: RootState) =>
  state.ifa.question;
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default ifaSlice.reducer;
