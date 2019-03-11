import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Tooltip from "rc-tooltip";
import { analytics, togglePasswordVisibility, validators, helpers } from "additional";
import ErrorFieldTooltip from "components/ui/error-field-tooltip";
import { push } from "react-router-redux";
import { WalletPath } from "routes";
import { error } from "modules/notifications";
import { authOperations as operations, authTypes as types } from "modules/auth";
import { exceptions } from "config";
import { USERNAME_MAX_LENGTH } from "config/consts";

const spinner = <span className="spinner" />;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordError: null,
            processing: false,
            tooltips: {
                recover_wallet: [
                    "You can use wallet recovery procedure in 2 situations:",
                    "1) If you want to use your existing Bitcoin wallet for Lightning payments,",
                    "go through the wallet recovery procedure, during which specify seed words",
                    "from your Bitcoin wallet.",
                    <Fragment>2) If you have forgotten your Peach Wallet password. Enter <b>new</b></Fragment>,
                    <Fragment>username, <b>new</b> password and use seed words associated with it.</Fragment>,
                ],
                username: [
                    "Username is a name of wallet (folder),",
                    "it is stored locally on your PC.",
                ],
            },
            usernameError: null,
        };
        analytics.pageview("/login", "Login");
    }

    showRegistration = (e) => {
        const { dispatch } = this.props;
        analytics.event({ action: "Login", category: "Auth", label: e.target.innerText });
        dispatch(operations.setForm(types.REGISTRATION_FORM));
    };

    showRestore = (e) => {
        const { dispatch } = this.props;
        analytics.event({ action: "Login", category: "Auth", label: e.target.innerText });
        dispatch(operations.setForm(types.RESTORE_WALLET_FORM));
    };

    handleLogin = async (e) => {
        e.preventDefault();
        analytics.event({ action: "Login", category: "Auth", label: "Sign in" });
        this.setState({ processing: true });
        const { dispatch } = this.props;
        const handleError = (msg) => {
            this.setState({ processing: false });
            dispatch(error({ message: helpers.formatNotificationMessage(msg) }));
        };
        const username = this.username.value.trim();
        const password = this.password.value.trim();
        const usernameError = validators.validateName(username, true, false, false);
        const passwordError = !password ? exceptions.FIELD_IS_REQUIRED : null;

        if (usernameError || passwordError) {
            this.setState({ passwordError, processing: false, usernameError });
            return;
        }
        this.setState({ passwordError, usernameError });

        await window.ipcClient("loadLndPath", { username });
        const init = await dispatch(operations.login(username, password));
        this.setState({ processing: false });
        if (!init.ok) {
            handleError(init.error);
            return;
        }
        dispatch(operations.setHashedPassword(password));
        dispatch(push(WalletPath));
    };

    showStatus = () => {
        const {
            networkBlocks,
            initStatus,
            isIniting,
            lndBlocks,
            lndBlocksOnLogin,
            lndSyncedToChain,
        } = this.props;
        if (!isIniting) {
            return null;
        }
        let percent = networkBlocks < 1
            ? ""
            : Math.min(
                Math.round(((lndBlocks - lndBlocksOnLogin) * 100) / Math.max(networkBlocks - lndBlocksOnLogin, 1)),
                99,
            );
        if (lndSyncedToChain) {
            percent = 100;
        }
        return (
            <div className="row h-sync">
                <div className="col-xs-12">
                    <div className="h-sync__percent text-center">{percent ? `${percent}%` : ""}</div>
                    <progress max={100} value={percent} className="h-sync__progress" />
                    <div className="h-sync__text text-center">
                        {initStatus}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const disabled = this.state.processing;
        return (
            <Fragment>
                <div className="row row--no-col justify-center-xs">
                    <div className="block__title">
                        Unlock your wallet
                    </div>
                </div>
                <form className="form form--home" onSubmit={this.handleLogin}>
                    <div className="block__row-lg">
                        <div className="col-xs-12">
                            <div className="form-label">
                                <label htmlFor="username">
                                    Wallet Name
                                </label>
                                <Tooltip
                                    placement="right"
                                    overlay={helpers.formatMultilineText(this.state.tooltips.username)}
                                    trigger="hover"
                                    arrowContent={
                                        <div className="rc-tooltip-arrow-inner" />
                                    }
                                    prefixCls="rc-tooltip__small rc-tooltip"
                                    mouseLeaveDelay={0}
                                >
                                    <i className="tooltip tooltip--info" />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <input
                                id="username"
                                className={`form-text ${this.state.usernameError ? "form-text__error" : ""}`}
                                placeholder="Enter your username"
                                ref={(ref) => {
                                    this.username = ref;
                                }}
                                disabled={disabled}
                                max={USERNAME_MAX_LENGTH}
                                maxLength={USERNAME_MAX_LENGTH}
                                onChange={() => { this.setState({ usernameError: null }) }}
                            />
                            <ErrorFieldTooltip text={this.state.usernameError} />
                        </div>
                    </div>
                    <div className="block__row">
                        <div className="col-xs-12">
                            <div className="form-label">
                                <label htmlFor="password">
                                    Password
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <input
                                id="password"
                                className={`form-text form-text--icon_eye ${this.state.passwordError ?
                                    "form-text__error" :
                                    ""}`}
                                name="password"
                                type="password"
                                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                ref={(ref) => {
                                    this.password = ref;
                                }}
                                disabled={disabled}
                                onChange={() => { this.setState({ passwordError: null }) }}
                            />
                            <i
                                className="form-text__icon form-text__icon--eye form-text__icon--eye_open"
                                onClick={togglePasswordVisibility}
                            />
                            <ErrorFieldTooltip text={this.state.passwordError} />
                        </div>
                    </div>
                    <div className="block__row-lg">
                        <div className="col-xs-12">
                            <button
                                type="submit"
                                className="button button__solid button--fullwide"
                                disabled={disabled}
                            >
                                Enter
                            </button>
                            {disabled ? spinner : null}
                        </div>
                    </div>
                    <div className="block__row row--no-col justify-between-xs font-12">
                        <div className="block__row-item">
                            <button
                                type="button"
                                className="link link--bold"
                                onClick={this.showRestore}
                                disabled={disabled}
                            >
                                Wallet recovery
                            </button>
                            <Tooltip
                                placement="right"
                                overlay={helpers.formatMultilineText(this.state.tooltips.recover_wallet)}
                                trigger="hover"
                                arrowContent={
                                    <div className="rc-tooltip-arrow-inner" />
                                }
                                prefixCls="rc-tooltip__small rc-tooltip"
                                mouseLeaveDelay={0}
                            >
                                <i className="tooltip tooltip--info" />
                            </Tooltip>
                        </div>
                        <div className="block__row-item">
                            <button
                                type="button"
                                className="link link--bold"
                                onClick={this.showRegistration}
                                disabled={disabled}
                            >
                                Create a new wallet
                            </button>
                        </div>
                    </div>
                    {this.showStatus()}
                </form>
            </Fragment>
        );
    }
}

Login.propTypes = {
    dispatch: PropTypes.func.isRequired,
    initStatus: PropTypes.string,
    isIniting: PropTypes.bool,
    lndBlocks: PropTypes.number.isRequired,
    lndBlocksOnLogin: PropTypes.number.isRequired,
    lndSyncedToChain: PropTypes.bool,
    networkBlocks: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    initStatus: state.lnd.initStatus,
    isIniting: state.account.isIniting,
    lndBlocks: state.lnd.lndBlocks,
    lndBlocksOnLogin: state.lnd.lndBlocksOnLogin,
    lndSyncedToChain: state.lnd.lndSyncedToChain,
    networkBlocks: state.server.networkBlocks,
});

export default connect(mapStateToProps)(Login);
