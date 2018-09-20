import "./styles/styles.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { PortWidget } from "storm-react-diagrams";
import { Tile } from "carbon-components-react";

import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import pencilIcon from "../../img/pencil.svg";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "../BodyWidget/reducer";

import DisplayForm from "./DisplayForm";

const AboutPlatformLI = () => <img src={pencilIcon} />;

export class IngestCSVNodeWidget extends Component {
  state = {};

  render() {
    console.log(this.props);
    return (
      <div
        className={"ingestcsv-node"}
        style={{
          position: "relative",
          width: 125,
          height: 125
        }}
      >
        <Tile className="ingestcsv-tile"> {this.props.node.taskName} </Tile>
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 125 / 2 - 8,
            left: -8
          }}
        >
          <PortWidget name="left" node={this.props.node} />
        </div>
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            left: 125 - 8,
            top: 125 / 2 - 8
          }}
        >
          <PortWidget name="right" node={this.props.node} />
        </div>

        <div
          style={{
            position: "absolute",
            zIndex: 10,
            left: 125 - 15,
            top: 0
          }}
        >
          <Modal
            ModalTrigger={AboutPlatformLI}
            //config={this.props.task}
            modalContent={(closeModal, ...rest) => (
              <ModalFlow
                headerTitle="Change Owner"
                headerSubtitle="It's not really mutiny..."
                components={[{ step: 0, component: DisplayForm }]}
                closeModal={closeModal}
                confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
                config={this.props.task}
                //theme={"bmrg-white"}
                {...rest}
              />
            )}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log("finding the proper task");
  //return { task: state.tasks.data.filter(task => task.id === ownProps.node.taskId)[0] };
  return { task: state.tasks.data.find(task => task.id === ownProps.node.taskId) };
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IngestCSVNodeWidget);
