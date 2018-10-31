import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import contactJoe from "./contactJoe";
import navbarLinks from "./navbarLinks";
import privacyStatement from "./privacyStatement";
import reportBug from "./reportBug";
import tasks from "./tasks";
import teams from "./teams";
import user from "./user";
import workflow from "./workflow";
import workflowRevision from "./workflowRevision";

const rootReducer = combineReducers({
  routing: routerReducer,
  contactJoe,
  navbarLinks,
  privacyStatement,
  reportBug,
  tasks,
  teams,
  user,
  workflow,
  workflowRevision
});

export default rootReducer;
