import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import WorkflowExecutionPort from "Components/WorkflowExecutionPort";
import mapTaskNametoIcon from "Utilities/taskIcons";
import styles from "./WorkflowNode.module.scss";

WorkflowNode.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.node,
  isExecution: PropTypes.bool,
  name: PropTypes.string,
  node: PropTypes.object.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string
};

export default function WorkflowNode({
  category,
  className,
  children,
  icon,
  isExecution,
  name,
  node,
  subtitle,
  subtitleClass,
  rightPortClass,
  title,
  ...rest
}) {
  return (
    <div className={cx(styles.node, className)} {...rest}>
      <header className={styles.header}>
        {icon ? icon : mapTaskNametoIcon(name, category).iconImg}
        <h1 className={styles.title}>{title || "Task"}</h1>
      </header>
      <p className={cx(styles.subtitle, subtitleClass)}>{subtitle || "Task"}</p>
      <WorkflowExecutionPort isExecution={isExecution} name="left" node={node} port="left" />
      <WorkflowExecutionPort
        className={rightPortClass}
        isExecution={isExecution}
        name="right"
        node={node}
        port="right"
      />
      {children}
    </div>
  );
}