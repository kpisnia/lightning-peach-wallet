import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { routes } from "config";
import { accountActions, accountTypes } from "modules/account";
import { authOperations as operations, authTypes as types } from "modules/auth";
import { lndOperations } from "modules/lnd";

import WalletModeComponent from "components/wallet-mode";

class Terms extends Component {
    onChooseMode = () => {
        const { dispatch, method } = this.props;
        if (method === types.RESTORE_TYPE_SEED) {
            dispatch(operations.setAuthStep(types.RESTORE_STEP_SEED));
        } else {
            dispatch(push(routes.WalletPath));
        }
    };

    goBack = () => {
        const { dispatch } = this.props;
        dispatch(accountActions.setWalletMode(accountTypes.WALLET_MODE.PENDING));
        dispatch(operations.setAuthStep(types.RESTORE_STEP_TERMS));
    };

    render() {
        return (
            <Fragment>
                <div className="row justify-center-xs">
                    <div className="block__title">
                        Choose Wallet Privacy Mode
                    </div>
                </div>
                <div className="privacy">
                    <div className="block__row-lg">
                        <div className="col-xs-12">
                            <WalletModeComponent callback={this.onChooseMode} onlyToStore />
                        </div>
                    </div>
                    <div className="block__row-lg row--no-col justify-center-xs">
                        <button
                            type="button"
                            className="button button__solid button__solid--transparent"
                            onClick={this.goBack}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

Terms.propTypes = {
    dispatch: PropTypes.func.isRequired,
    method: PropTypes.PropTypes.oneOf([
        types.RESTORE_TYPE_SEED,
        types.RESTORE_TYPE_FOLDER,
    ]).isRequired,
};

export default connect()(Terms);
