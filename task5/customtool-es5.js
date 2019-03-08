"use strict";

// Bind the form controls to the loan fields
var bindToControls = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var loan, inputs, _loop, i;

        return regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return elli.script.getObject("loan");

                    case 2:
                        loan = _context2.sent;


                        // Retrieve all input elements on the page
                        inputs = document.querySelectorAll("[data-field-id]");
                        _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                            var elm, fieldId, fieldValue;
                            return regeneratorRuntime.wrap(function _loop$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            elm = inputs[i];

                                            // Read the custom field ID attribute -- this
                                            // will contain the loan Field ID for the box

                                            fieldId = elm.getAttribute("data-field-id");
                                            _context.next = 4;
                                            return loan.getField(fieldId);

                                        case 4:
                                            fieldValue = _context.sent;

                                            if (fieldValue) elm.value = fieldValue.toString();

                                            // Bind to the contol's change event to update the field
                                            // back to the loan object
                                            elm.addEventListener("change", function (event) {
                                                // Create a name/value map with the field ID/value
                                                loan.setFields(_defineProperty({}, fieldId, event.target.value));

                                                // Force an invocation of all calcs for the field
                                                loan.calculate().then(function () {
                                                    displayLoanJSON();
                                                });
                                            });

                                        case 7:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _loop, _this);
                        });
                        i = 0;

                    case 6:
                        if (!(i < inputs.length)) {
                            _context2.next = 11;
                            break;
                        }

                        return _context2.delegateYield(_loop(i), "t0", 8);

                    case 8:
                        i++;
                        _context2.next = 6;
                        break;

                    case 11:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee, this);
    }));

    return function bindToControls() {
        return _ref.apply(this, arguments);
    };
}();

// Retrieves the full Loan JSON and displays it into the form


var displayLoanJSON = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var loan, loanData;
        return regeneratorRuntime.wrap(function _callee2$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return elli.script.getObject("loan");

                    case 2:
                        loan = _context3.sent;
                        _context3.next = 5;
                        return loan.all();

                    case 5:
                        loanData = _context3.sent;


                        document.getElementById("loanJson").innerText = JSON.stringify(loanData, null, 3);

                    case 7:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee2, this);
    }));

    return function displayLoanJSON() {
        return _ref2.apply(this, arguments);
    };
}();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Hook up the initialization function
window.addEventListener("load", function () {
    elli.script.connect();
    bindToControls();
    displayLoanJSON();
});