import React from "react";
import PropTypes from "prop-types";
import { useWorkflowContext } from "Hooks";
import { ComposedModal } from "@boomerang/carbon-addons-boomerang-react";
import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import WorkflowNode from "Components/WorkflowNode";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import styles from "./CustomTaskNodeDesigner.module.scss";

CustomTaskNodeDesigner.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
};

CustomTaskNodeDesigner.defaultProps = {
  node: {},
};

export default function CustomTaskNodeDesigner({ diagramEngine, node: designerNode }) {
  const { revisionDispatch, revisionState, summaryQuery, taskTemplatesData } = useWorkflowContext();

  /**
   * Pull data off of context
   */
  const inputProperties = summaryQuery.data.properties;
  const nodeDag = revisionState.dag?.nodes?.find((revisionNode) => revisionNode.nodeId === designerNode.id) ?? {};
  const nodeConfig = revisionState.config[designerNode.id] ?? {};
  const task = taskTemplatesData.find((taskTemplate) => taskTemplate.id === designerNode.taskId);

  // Get the taskNames names from the nodes on the model
  const taskNames = Object.values(diagramEngine.getDiagramModel().getNodes())
    .map((node) => node.taskName)
    .filter((name) => Boolean(name));

  /**
   * Event handlers
   */
  const handleOnUpdateTaskVersion = ({ version, inputs }) => {
    revisionDispatch({
      type: "UPDATE_NODE_TASK_VERSION",
      data: { nodeId: designerNode.id, inputs, version },
    });
  };

  const handleOnSaveTaskConfig = (inputs) => {
    revisionDispatch({
      type: "UPDATE_NODE_CONFIG",
      data: { nodeId: designerNode.id, inputs },
    });
  };

  // Delete the node in state and then remove it from the diagram
  const handleOnDelete = () => {
    //deleteNode
    revisionDispatch({
      type: "DELETE_NODE",
      data: { nodeId: designerNode.id },
    });
    designerNode.remove();
  };

  const renderConfigureTask = () => {
    return (
      <ComposedModal
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved",
        }}
        modalHeaderProps={{
          title: `Edit ${task.name}`,
          subtitle: task.description || "Configure the inputs",
        }}
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
      >
        {({ closeModal }) => (
          <WorkflowTaskForm
            inputProperties={inputProperties}
            closeModal={closeModal}
            node={designerNode}
            nodeConfig={nodeConfig}
            onSave={handleOnSaveTaskConfig}
            taskNames={taskNames}
            task={task}
          />
        )}
      </ComposedModal>
    );
  };

  const renderUpdateTaskVersion = () => {
    return (
      <ComposedModal
        composedModalProps={{
          containerClassName: styles.updateTaskModalContainer,
          shouldCloseOnOverlayClick: false,
        }}
        modalHeaderProps={{
          title: `New version available`,
          subtitle:
            "The managers of this task have made some changes that were significant enough for a new version. You can still use the current version, but it’s usually a good idea to update when available. The details of the change are outlined below. If you’d like to update, review the changes below and make adjustments if needed. This process will only update the task in this Workflow - not any other workflows where this task appears.",
        }}
        modalTrigger={({ openModal }) =>
          nodeDag?.templateUpgradeAvailable ? (
            <WorkflowWarningButton className={styles.updateButton} onClick={openModal} />
          ) : null
        }
      >
        {({ closeModal }) => (
          <TaskUpdateModal
            closeModal={closeModal}
            inputProperties={inputProperties}
            node={designerNode}
            nodeConfig={nodeConfig}
            onSave={handleOnUpdateTaskVersion}
            taskNames={taskNames}
            task={task}
          />
        )}
      </ComposedModal>
    );
  };

  if (nodeConfig && nodeDag && task) {
    return (
      <WorkflowNode
        category={task.category}
        className={styles.node}
        icon={task.icon}
        name={task.name}
        node={designerNode}
        subtitle={designerNode.taskName}
        title={task.name}
      >
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Custom</p>
        </div>
        {renderUpdateTaskVersion()}
        {renderConfigureTask()}
        <WorkflowCloseButton className={styles.closeButton} onClick={handleOnDelete} />
      </WorkflowNode>
    );
  }
  return null;
}
