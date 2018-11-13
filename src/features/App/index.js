import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as userActions } from "State/user";
import { actions as navbarLinksActions } from "State/navbarLinks";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { NotificationContainer } from "@boomerang/boomerang-components/lib/Notifications";
import WorkflowActivity from "Features/WorkflowActivity";
import WorkflowsHome from "Features/WorkflowsHome";
import WorkflowManager from "Features/WorkflowManager";
import WorkflowsViewer from "Features/WorkflowsViewer";
import WorkflowExecution from "Features/WorkflowExecution";
import Navigation from "./Navigation";
import { BASE_LAUNCHPAD_SERVICE_URL } from "Config/servicesConfig";
import "./styles.scss";

class App extends Component {
  componentDidMount() {
    this.fetchData();
  }

  refreshPage = () => {
    this.fetchData();
  };

  fetchData = () => {
    this.props.userActions.fetch(`${BASE_LAUNCHPAD_SERVICE_URL}/users`);
    this.props.navbarLinksActions.fetch(`${BASE_LAUNCHPAD_SERVICE_URL}/navigation`);
  };

  render() {
    return (
      <>
        <Navigation user={this.props.user} navbarLinks={this.props.navbarLinks} refresh={this.refreshPage} />
        <main className="c-app-main">
          <Switch>
            <Route path="/workflows" component={WorkflowsHome} />
            <Route path="/activity/:workflowId/execution/:executionId" component={WorkflowExecution} />
            <Route path="/activity" component={WorkflowActivity} exact />
            <Route path="/creator" component={WorkflowManager} />
            <Route path="/editor/:workflowId" component={WorkflowManager} />
            <Route path="/viewer" component={WorkflowsViewer} />
            <Redirect from="/" to="/workflows" />
          </Switch>
        </main>
        <NotificationContainer />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    navbarLinks: state.navbarLinks
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    navbarLinksActions: bindActionCreators(navbarLinksActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
