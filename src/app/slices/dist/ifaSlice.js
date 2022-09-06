"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.selectOduHistory = exports.selectCurrentOdu = exports.castOdu = exports.ifaSlice = exports.searchRoomAsync = exports.LegName = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var react_toastify_1 = require("react-toastify");
var position = {
    position: react_toastify_1.toast.POSITION.BOTTOM_RIGHT
};
var LegEntry;
(function (LegEntry) {
    LegEntry[LegEntry["leg0"] = 0] = "leg0";
    LegEntry[LegEntry["leg1"] = 1] = "leg1";
})(LegEntry || (LegEntry = {}));
var IndexOfLeg;
(function (IndexOfLeg) {
    IndexOfLeg[IndexOfLeg["zero"] = 0] = "zero";
    IndexOfLeg[IndexOfLeg["one"] = 1] = "one";
    IndexOfLeg[IndexOfLeg["two"] = 2] = "two";
    IndexOfLeg[IndexOfLeg["three"] = 3] = "three";
})(IndexOfLeg || (IndexOfLeg = {}));
var LegName;
(function (LegName) {
    LegName["ogbe"] = "Ogb\u00E8";
    LegName["oyeku"] = "\u1ECC\u0300y\u1EB9\u0300k\u00FA";
    LegName["iwori"] = "\u00CCw\u00F2r\u00EC";
    LegName["odi"] = "\u00D2d\u00ED";
    LegName["irosun"] = "\u00CCros\u00F9n";
    LegName["owonrin"] = "\u1ECC\u0300w\u1ECD\u0301nr\u00EDn";
    LegName["obara"] = "\u1ECC\u0300b\u00E0r\u00E0";
    LegName["okanran"] = "\u1ECC\u0300k\u00E0nr\u00E0n";
    LegName["ogunda"] = "\u00D2g\u00FAnd\u00E1";
    LegName["osa"] = "\u1ECC\u0300s\u00E1";
    LegName["ika"] = "\u00CCk\u00E1";
    LegName["oturupon"] = "\u00D2t\u00FA\u00FAr\u00FAp\u1ECD\u0300n";
    LegName["otura"] = "\u00D2t\u00FAr\u00E1";
    LegName["irete"] = "\u00CCr\u1EB9\u0300t\u1EB9\u0300 ";
    LegName["ose"] = "\u1ECC\u0300\u1E63\u1EB9\u0301 ";
    LegName["ofun"] = "\u00D2f\u00FAn";
})(LegName = exports.LegName || (exports.LegName = {}));
var initialState = {
    current: {
        leg0: { 0: true, 1: true, 2: true, 3: true },
        leg1: { 0: true, 1: true, 2: true, 3: true },
        nameLeg0: undefined,
        nameLeg1: undefined,
        oduNames: [],
        createdAt: new Date()
    },
    history: [],
    isFetching: false
};
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
var getLegName = function (leg) {
    if (leg[0] === true &&
        leg[1] === true &&
        leg[2] === true &&
        leg[3] === true) {
        return LegName.ogbe;
    }
    else if (leg[0] === false &&
        leg[1] === false &&
        leg[2] === false &&
        leg[3] === false) {
        return LegName.oyeku;
    }
    else if (leg[0] === false &&
        leg[1] === true &&
        leg[2] === true &&
        leg[3] === false) {
        return LegName.iwori;
    }
    else if (leg[0] === true &&
        leg[1] === false &&
        leg[2] === false &&
        leg[3] === true) {
        return LegName.odi;
    }
    else if (leg[0] === true &&
        leg[1] === true &&
        leg[2] === false &&
        leg[3] === false) {
        return LegName.irosun;
    }
    else if (leg[0] === false &&
        leg[1] === false &&
        leg[2] === true &&
        leg[3] === true) {
        return LegName.owonrin;
    }
    else if (leg[0] === true &&
        leg[1] === false &&
        leg[2] === false &&
        leg[3] === false) {
        return LegName.obara;
    }
    else if (leg[0] === false &&
        leg[1] === false &&
        leg[2] === false &&
        leg[3] === true) {
        return LegName.okanran;
    }
    else if (leg[0] === true &&
        leg[1] === true &&
        leg[2] === true &&
        leg[3] === false) {
        return LegName.ogunda;
    }
    else if (leg[0] === false &&
        leg[1] === true &&
        leg[2] === true &&
        leg[3] === true) {
        return LegName.osa;
    }
    else if (leg[0] === false &&
        leg[1] === true &&
        leg[2] === false &&
        leg[3] === false) {
        return LegName.ika;
    }
    else if (leg[0] === false &&
        leg[1] === false &&
        leg[2] === true &&
        leg[3] === false) {
        return LegName.oturupon;
    }
    else if (leg[0] === true &&
        leg[1] === false &&
        leg[2] === true &&
        leg[3] === true) {
        return LegName.otura;
    }
    else if (leg[0] === true &&
        leg[1] === true &&
        leg[2] === false &&
        leg[3] === true) {
        return LegName.irete;
    }
    else if (leg[0] === true &&
        leg[1] === false &&
        leg[2] === true &&
        leg[3] === false) {
        return LegName.ose;
    }
    else if (leg[0] === false &&
        leg[1] === true &&
        leg[2] === false &&
        leg[3] === true) {
        return LegName.ofun;
    }
    else {
        console.log(leg);
        return LegName.ika;
    }
};
exports.searchRoomAsync = toolkit_1.createAsyncThunk("ifa/searchRoom", function (props) { return __awaiter(void 0, void 0, void 0, function () {
    var current;
    return __generator(this, function (_a) {
        current = props.current;
        return [2 /*return*/, current];
    });
}); });
exports.ifaSlice = toolkit_1.createSlice({
    name: "ifa",
    initialState: initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        castOdu: function (state) {
            var _a;
            var leg0 = {
                0: !!Math.round(Math.random()),
                1: !!Math.round(Math.random()),
                2: !!Math.round(Math.random()),
                3: !!Math.round(Math.random())
            };
            var leg1 = {
                0: !!Math.round(Math.random()),
                1: !!Math.round(Math.random()),
                2: !!Math.round(Math.random()),
                3: !!Math.round(Math.random())
            };
            state.current = {
                leg0: leg0,
                leg1: leg1
            };
            if (!((_a = state.current.oduNames) === null || _a === void 0 ? void 0 : _a.length)) {
                var nameLeg0 = getLegName(leg0);
                var nameLeg1 = getLegName(leg1);
                console.log({ leg0: leg0, leg1: leg1, nameLeg0: nameLeg0, nameLeg1: nameLeg1 });
                var oduNames = [];
                console.log({ leg0: leg0, leg1: leg1, nameLeg0: nameLeg0, nameLeg1: nameLeg1 });
                if (nameLeg0 === nameLeg1) {
                    if (nameLeg0 === LegName.ogbe) {
                        oduNames = ["Èjìogbè"];
                    }
                    else if (nameLeg0 === LegName.ofun) {
                        oduNames = ["Ọ̀ràngún"];
                    }
                    else {
                        oduNames = [nameLeg0 + " m\u00E9j\u00EC"];
                    }
                }
                else {
                    oduNames = [nameLeg0 + " " + nameLeg1];
                }
                var randomValue = 0.48 + Math.random() / 4;
                var randomColor = Math.floor(randomValue * 16777215).toString(16);
                var createdAt = new Date();
                state.current = __assign(__assign({}, state.current), { nameLeg0: nameLeg0,
                    nameLeg1: nameLeg1,
                    oduNames: oduNames,
                    randomColor: randomColor,
                    createdAt: createdAt });
            }
            state.history = __spreadArrays([state.current], state.history);
        },
        modifyCurrentOdu: function (state, action) {
            if (action.payload) {
                var _a = action.payload, mark = _a.mark, currentOdu = _a.currentOdu;
                var legEntry = mark.legEntry, indexOfLeg = mark.indexOfLeg;
                var newOdu = __assign({}, currentOdu);
            }
        }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: function (builder) {
        builder
            .addCase(exports.searchRoomAsync.pending, function (state) {
            state.isFetching = true;
        })
            .addCase(exports.searchRoomAsync.fulfilled, function (state, action) {
            state.isFetching = false;
            if (!!action.payload) {
                state.current = action.payload;
            }
        })
            .addCase(exports.searchRoomAsync.rejected, function (state, action) {
            console.log(action);
            state.isFetching = false;
            react_toastify_1.toast(action.error.message, position);
        });
    }
});
exports.castOdu = exports.ifaSlice.actions.castOdu;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
exports.selectCurrentOdu = function (state) {
    return state.ifa.current;
};
exports.selectOduHistory = function (state) {
    return state.ifa.history;
};
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
exports["default"] = exports.ifaSlice.reducer;
