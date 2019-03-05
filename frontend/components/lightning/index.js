import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { analytics, helpers } from "additional";
import SubHeader from "components/subheader";
import {
    lightningOperations as operations,
    lightningTypes,
} from "modules/lightning";
import {
    contactsTypes,
    contactsOperations,
    contactsActions,
} from "modules/contacts";
import { accountTypes } from "modules/account";
import { channelsOperations, channelsSelectors } from "modules/channels";
import NewContact from "components/contacts/modal/new-contact";
import { appTypes } from "modules/app";
import { MODAL_ANIMATION_TIMEOUT } from "config/consts";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { LightningFullPath } from "routes";
import ChannelWarning from "./modal/channel_warning";
import RegularPayment from "./regular";
import RecurringPayment from "./recurring";

class Lightning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "regular",
        };
        analytics.pageview(`${LightningFullPath}/regular`, "Lightning / Regular Payment");
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(operations.getHistory());
        dispatch(channelsOperations.getChannels());
    }

    componentWillReceiveProps(nextProps) {
        const { activeTab } = this.state;
        if (nextProps.externalPaymentRequest && activeTab !== "regular") {
            this.setState({
                activeTab: "regular",
            });
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.modalState !== nextProps.modalState && nextProps.modalState === appTypes.CLOSE_MODAL_STATE) {
            let path;
            let title;
            if (this.state.activeTab === "regular") {
                path = `${LightningFullPath}/regular`;
                title = "Lightning / Regular Payment";
            } else if (this.state.activeTab === "recurring") {
                path = `${LightningFullPath}/recurring`;
                title = "Lightning / Recurring Payment";
            }
            analytics.pageview(path, title);
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(contactsActions.newContactAdded(null));
        dispatch(contactsOperations.setContactsSearch(null));
    }

    handleTabClick = (tab) => {
        if (this.state.activeTab !== tab) {
            let path;
            let title;
            if (tab === "regular") {
                path = `${LightningFullPath}/regular`;
                title = "Lightning / Regular Payment";
            } else if (tab === "recurring") {
                path = `${LightningFullPath}/recurring`;
                title = "Lightning / Recurring Payment";
            }
            analytics.pageview(path, title);
        }
        this.setState({ activeTab: tab });
    };

    render() {
        const { modalState, walletMode } = this.props;
        const { activeTab } = this.state;
        let modal;
        switch (modalState) {
            case lightningTypes.MODAL_STATE_CHANNEL_WARNING:
                modal = <ChannelWarning />;
                break;
            case contactsTypes.MODAL_STATE_NEW_CONTACT:
                modal = <NewContact page="lightning" />;
                break;
            default:
                modal = null;
                break;
        }
        let tabContent;
        switch (activeTab) {
            case "regular":
                tabContent = <RegularPayment />;
                break;
            case "recurring":
                tabContent = <RecurringPayment />;
                break;
            default:
                tabContent = null;
                break;
        }
        return [
            <SubHeader key={0} />,
            <div key={1} className="lightning lightning-page">
                <div className="container">
                    <div className="tabs">
                        <div className="tabs__row">
                            <a
                                className={`tab-link ${activeTab === "regular" ? "tab-link-active" : ""}`}
                                onClick={() => this.handleTabClick("regular")}
                            >
                                Regular payment
                            </a>
                            <a
                                className={`tab-link ${
                                    activeTab === "recurring" ? "tab-link-active" : ""
                                } ${walletMode !== accountTypes.WALLET_MODE.EXTENDED
                                    ? "button--locked"
                                    : ""}`}
                                onClick={() => this.handleTabClick("recurring")}
                            >
                                Recurring payment
                            </a>
                        </div>
                        {tabContent}
                    </div>
                </div>
            </div>,
            <ReactCSSTransitionGroup
                transitionName="modal-transition"
                transitionEnterTimeout={MODAL_ANIMATION_TIMEOUT}
                transitionLeaveTimeout={MODAL_ANIMATION_TIMEOUT}
                key={2}
            >
                {modal}
            </ReactCSSTransitionGroup>,
        ];
    }
}

Lightning.propTypes = {
    dispatch: PropTypes.func.isRequired,
    externalPaymentRequest: PropTypes.string,
    modalState: PropTypes.string,
    walletMode: PropTypes.oneOf([
        accountTypes.WALLET_MODE.EXTENDED,
        accountTypes.WALLET_MODE.STANDARD,
        accountTypes.WALLET_MODE.PENDING,
    ]),
};

const mapStateToProps = state => ({
    externalPaymentRequest: state.lightning.externalPaymentRequest,
    modalState: state.app.modalState,
    walletMode: state.account.walletMode,
});

export default connect(mapStateToProps)(Lightning);
