import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DigitsField from "components/ui/digitsField";

class Timepicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            from: {
                hours: null,
                meridiem: "AM",
                minutes: null,
            },
            showInput: false,
            to: {
                hours: null,
                meridiem: "AM",
                minutes: null,
            },
        };
    }

    componentDidMount() {
        document.addEventListener("keyup", this.handleKeyUp);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("touchend", this.handleTouchEnd);
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyUp);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("touchend", this.handleTouchEnd);
    }

    setFromMeridiem = (e) => {
        this.setState({
            from: {
                ...this.state.from,
                meridiem: e.target.getAttribute("data-name"),
            },
        });
    };

    setFromHours = () => {
        this.setState({
            from: {
                ...this.state.from,
                hours: this.dateFromHours.value.trim(),
            },
        });
    };

    setFromMinutes = () => {
        this.setState({
            from: {
                ...this.state.from,
                minutes: this.dateFromMinutes.value.trim(),
            },
        });
    };

    setToMeridiem = (e) => {
        this.setState({
            to: {
                ...this.state.to,
                meridiem: e.target.getAttribute("data-name"),
            },
        });
    };

    setToHours = () => {
        this.setState({
            to: {
                ...this.state.to,
                hours: this.dateToHours.value.trim(),
            },
        });
    };

    setToMinutes = () => {
        this.setState({
            to: {
                ...this.state.to,
                minutes: this.dateToMinutes.value.trim(),
            },
        });
    };

    handleKeyUp = (e) => {
        if (this.state.showInput && e.keyCode === 27) {
            this.hideInput();
        }
    };

    handleMouseUp = (e) => {
        if (this.state.showInput && !this.input.contains(e.target)) {
            this.hideInput();
        }
    };

    handleTouchEnd = (e) => {
        if (this.state.showInput && !this.input.contains(e.target)) {
            this.hideInput();
        }
    };

    hideInput = () => {
        this.setState({
            showInput: false,
        });
    };

    toggleDateInput = () => {
        this.setState({
            showInput: !this.state.showInput,
        });
    };

    reset = () => {
        this.dateFromHoursComponent.reset();
        this.dateFromMinutesComponent.reset();
        this.dateToHoursComponent.reset();
        this.dateToMinutesComponent.reset();
        this.setState({
            from: {
                hours: null,
                meridiem: "AM",
                minutes: null,
            },
            showInput: false,
            to: {
                hours: null,
                meridiem: "AM",
                minutes: null,
            },
        });
    };

    render() {
        const { className } = this.props;
        return (
            <div className="picker">
                <button
                    className={`button button__hollow picker__target ${className} ${
                        this.state.showInput ? "active" : ""
                    }`}
                    onClick={this.toggleDateInput}
                >
                    Time range
                </button>
                {this.state.showInput &&
                <div
                    className="picker__collapse"
                    ref={(ref) => { this.input = ref }}
                >
                    <div className="picker__row mt-14">
                        <div className="picker__label">
                            From
                        </div>
                        <div className="picker__group">
                            <DigitsField
                                id="date__from-hours"
                                className="form-text form-text--right"
                                pattern={/^([0-9]|1[0-1])$/}
                                name="date__from-hours"
                                ref={(ref) => {
                                    this.dateFromHoursComponent = ref;
                                }}
                                setRef={(ref) => {
                                    this.dateFromHours = ref;
                                }}
                                setOnChange={this.setFromHours}
                            />
                            <span className="picker__text--xl">:</span>
                            <DigitsField
                                id="date__from-minutes"
                                className="form-text"
                                pattern={/^([0-5]?[0-9])$/}
                                name="date__from-minutes"
                                ref={(ref) => {
                                    this.dateFromMinutesComponent = ref;
                                }}
                                setRef={(ref) => {
                                    this.dateFromMinutes = ref;
                                }}
                                setOnChange={this.setFromMinutes}
                            />
                        </div>
                        <div className="picker__group picker__group--vertical">
                            <button
                                className={`button button__link ${this.state.from.meridiem === "AM" ? "active" : ""}`}
                                onClick={this.setFromMeridiem}
                                data-name="AM"
                            >
                                AM
                            </button>
                            <button
                                className={`button button__link ${this.state.from.meridiem === "PM" ? "active" : ""}`}
                                onClick={this.setFromMeridiem}
                                data-name="PM"
                            >
                                PM
                            </button>
                        </div>
                    </div>
                    <div className="picker__row mt-14">
                        <div className="picker__label">
                            To
                        </div>
                        <div className="picker__group">
                            <DigitsField
                                id="date__to-hours"
                                className="form-text form-text--right"
                                pattern={/^([0-9]|1[0-1])$/}
                                name="date__to-hours"
                                ref={(ref) => {
                                    this.dateToHoursComponent = ref;
                                }}
                                setRef={(ref) => {
                                    this.dateToHours = ref;
                                }}
                                setOnChange={this.setToHours}
                            />
                            <span className="picker__text--xl">:</span>
                            <DigitsField
                                id="date__to-minutes"
                                className="form-text"
                                pattern={/^([0-5]?[0-9])$/}
                                name="date__to-minutes"
                                ref={(ref) => {
                                    this.dateToMinutesComponent = ref;
                                }}
                                setRef={(ref) => {
                                    this.dateToMinutes = ref;
                                }}
                                setOnChange={this.setToMinutes}
                            />
                        </div>
                        <div className="picker__group picker__group--vertical">
                            <button
                                className={`button button__link ${this.state.to.meridiem === "AM" ? "active" : ""}`}
                                onClick={this.setToMeridiem}
                                data-name="AM"
                            >
                                AM
                            </button>
                            <button
                                className={`button button__link ${this.state.to.meridiem === "PM" ? "active" : ""}`}
                                onClick={this.setToMeridiem}
                                data-name="PM"
                            >
                                PM
                            </button>
                        </div>
                    </div>
                    <div className="picker__row picker__row--controls mt-14">
                        <button
                            className="button button__link"
                            onClick={this.reset}
                        >
                            Reset
                        </button>
                        <div className="picker__group">
                            <button
                                className="button button__link"
                                onClick={this.hideInput}
                            >
                                Cancel
                            </button>
                            <button
                                className="button button__link"
                                onClick={this.hideInput}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}

Timepicker.propTypes = {
    className: PropTypes.string,
};

export default connect(null)(Timepicker);