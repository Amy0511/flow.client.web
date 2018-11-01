import React from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import Filler from "./Filler";
import "./styles.scss";

const TimeProgressBar = ({ tasks }) => {

  const steps = orderBy(tasks.steps, ["order"], ["asc"]);
  const totalDuration = tasks.duration;

  return (
    <div className="c-time-progress-bar">
      <div className="b-time-progress-bar">
        <div className="b-time-progress-bar__start">Start</div>
        <div className="b-time-progress-bar__finish">Finish</div>
        <div className="b-time-progress-bar__fillers">
          {steps.map((step, index) => (
            <Filler
              key={step.taskId}
              index={index}
              finishPosition={(((step.startTime - tasks.creationDate) + step.duration) / totalDuration) * 100}
              totalDuration={totalDuration}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

TimeProgressBar.propTypes = {
  tasks: PropTypes.object.isRequired
};

export default TimeProgressBar;
