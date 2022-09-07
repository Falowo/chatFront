"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./oponIfa.css");
var square_opon_ifa_black_jpg_1 = require("../../components/sidebar/square-opon-ifa-black.jpg");
var Grid_1 = require("@mui/material/Grid");
var Box_1 = require("@mui/material/Box");
var hooks_1 = require("../../app/hooks");
var ifaSlice_1 = require("../../app/slices/ifaSlice");
var timeago = require("timeago.js");
function OponIfa() {
    var _a;
    var dispatch = hooks_1.useAppDispatch();
    var currentOdu = hooks_1.useAppSelector(ifaSlice_1.selectCurrentOdu);
    var oduHistory = hooks_1.useAppSelector(ifaSlice_1.selectOduHistory);
    var textShadow = "-4px 1px #002021";
    return (react_1["default"].createElement(Box_1["default"], { sx: {
            width: "64vw",
            height: "100vh",
            margin: "0 auto !important",
            padding: "0 auto !important"
        } },
        react_1["default"].createElement("h1", { style: {
                textAlign: "center",
                color: "" + (!!currentOdu.randomColor
                    ? "#" + currentOdu.randomColor
                    : "white")
            } }, !!((_a = currentOdu === null || currentOdu === void 0 ? void 0 : currentOdu.oduNames) === null || _a === void 0 ? void 0 : _a.length)
            ? currentOdu === null || currentOdu === void 0 ? void 0 : currentOdu.oduNames[0] : "Opele mi"),
        react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { className: "divImageOpon", onClick: function () { return dispatch(ifaSlice_1.castOdu()); } },
                react_1["default"].createElement("img", { className: "imageOpon", src: square_opon_ifa_black_jpg_1["default"], alt: "Opon Ifa" })),
            react_1["default"].createElement(Grid_1["default"], { className: "printGrid", container: true, spacing: 1, margin: "0 auto", width: "100%", onClick: function (e) {
                    e.stopPropagation();
                    dispatch(ifaSlice_1.castOdu());
                } },
                react_1["default"].createElement(Grid_1["default"], { xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: true,
                                indexOfLeg: 0
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg1[0] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: false,
                                indexOfLeg: 0
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg0[0] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: true,
                                indexOfLeg: 1
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg1[1] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: false,
                                indexOfLeg: 1
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg0[1] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: true,
                                indexOfLeg: 2
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg1[2] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: false,
                                indexOfLeg: 2
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg0[2] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: true,
                                indexOfLeg: 3
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg1[3] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 1.5 },
                    react_1["default"].createElement("h2", { onClick: function (e) {
                            e.stopPropagation();
                            var mark = {
                                legEntry: false,
                                indexOfLeg: 3
                            };
                            var payload = { mark: mark, currentOdu: currentOdu };
                            dispatch(ifaSlice_1.modifyCurrentOdu(payload));
                        }, className: "markItem", style: {
                            textShadow: textShadow,
                            color: !!currentOdu.randomColor
                                ? "" + ("#" + currentOdu.randomColor)
                                : "white"
                        } }, currentOdu.leg0[3] === true ? "I" : "II")),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 4.5 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 8 }),
                react_1["default"].createElement(Grid_1["default"], { item: true, xs: 4 },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("div", { className: "oduHistoryList" }, !!oduHistory &&
                            !!(oduHistory === null || oduHistory === void 0 ? void 0 : oduHistory.length) &&
                            oduHistory
                                .filter(function (o) {
                                return oduHistory.indexOf(o) < 8 &&
                                    oduHistory.indexOf(o) !== 0;
                            })
                                .map(function (o) {
                                var _a;
                                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                                    react_1["default"].createElement("li", { className: "oduHistoryListItems", style: {
                                            color: !!o.randomColor
                                                ? "" + ("#" + o.randomColor)
                                                : "white"
                                        } }, !!((_a = o === null || o === void 0 ? void 0 : o.oduNames) === null || _a === void 0 ? void 0 : _a.length) &&
                                        o.oduNames[0]),
                                    react_1["default"].createElement("span", { className: "spanTimeAgo", style: {
                                            color: !!o.randomColor
                                                ? "" + ("#" + o.randomColor)
                                                : "white"
                                        } }, !!o.createdAt &&
                                        timeago.format(o.createdAt))));
                            }))))))));
}
exports["default"] = OponIfa;
