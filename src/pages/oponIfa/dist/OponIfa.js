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
exports.__esModule = true;
var react_1 = require("react");
require("./oponIfa.css");
var square_opon_ifa_black_jpg_1 = require("../../components/sidebar/square-opon-ifa-black.jpg");
var styles_1 = require("@mui/material/styles");
var Grid_1 = require("@mui/material/Grid");
var Paper_1 = require("@mui/material/Paper");
var Box_1 = require("@mui/material/Box");
var hooks_1 = require("../../app/hooks");
var ifaSlice_1 = require("../../app/slices/ifaSlice");
var Item = styles_1.styled(Paper_1["default"])(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({ backgroundColor: "transparent" }, theme.typography.body2), { padding: theme.spacing(1), textAlign: "center", color: "white", fontWeight: 900, fontSize: "3rem" }));
});
function OponIfa() {
    var _a;
    var dispatch = hooks_1.useAppDispatch();
    var currentOdu = hooks_1.useAppSelector(ifaSlice_1.selectCurrentOdu);
    var oduHistory = hooks_1.useAppSelector(ifaSlice_1.selectOduHistory);
    react_1.useEffect(function () {
        var _a;
        console.log({ currentOdu: currentOdu, oduHistory: oduHistory });
        currentOdu.leg0 &&
            currentOdu.leg1 &&
            !((_a = currentOdu.oduNames) === null || _a === void 0 ? void 0 : _a.length) &&
            console.log({ currentOdu: currentOdu });
        // dispatch(nameOduAsync({ currentOdu }));
    }, [currentOdu, currentOdu.leg0, currentOdu.leg1, dispatch, oduHistory]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Box_1["default"], { sx: {
                width: "64vw",
                height: "100vh",
                margin: "auto",
                backgroundColor: "black"
            } },
            react_1["default"].createElement("h1", { style: { textAlign: "center" } }, " Opele mi"),
            react_1["default"].createElement("div", { className: "oponDiv", onClick: function () { return dispatch(ifaSlice_1.castOdu()); } },
                react_1["default"].createElement("img", { className: "imageOpon", src: square_opon_ifa_black_jpg_1["default"], alt: "Opon Ifa" }),
                react_1["default"].createElement(Grid_1["default"], { className: "printGrid", container: true, spacing: 1, sx: { paddingLeft: "30%", paddingRight: "30%" }, margin: "0 auto", width: "100%" },
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 }, currentOdu.leg1[0] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 }, currentOdu.leg0[0] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 },
                            " ",
                            currentOdu.leg1[1] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 }, currentOdu.leg0[1] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 }, currentOdu.leg1[2] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 }, currentOdu.leg0[2] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 }, currentOdu.leg1[3] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 6 },
                        react_1["default"].createElement(Item, { elevation: 0 }, currentOdu.leg0[3] === true ? "I" : "II")),
                    react_1["default"].createElement(Grid_1["default"], { item: true, xs: 12 },
                        react_1["default"].createElement(Item, { elevation: 0 }, !!((_a = currentOdu === null || currentOdu === void 0 ? void 0 : currentOdu.oduNames) === null || _a === void 0 ? void 0 : _a.length) && (currentOdu === null || currentOdu === void 0 ? void 0 : currentOdu.oduNames[0])))))),
        react_1["default"].createElement(Box_1["default"], null)));
}
exports["default"] = OponIfa;
