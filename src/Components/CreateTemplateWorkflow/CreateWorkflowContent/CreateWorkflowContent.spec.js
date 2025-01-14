/* eslint-disable jest/no-commented-out-tests */
import React from "react";
import CreateWorkflowContent from "../CreateWorkflowContent";

// import { screen, fireEvent } from "@testing-library/react";

const mockfn = jest.fn();
const props = {
  createWorkflow: mockfn,
  isLoading: false,
  names: [],
  teams: [{ value: "test", label: "Test" }],
  scope: "user",
  formData: {
    selectedWorkflow: {
      name: "test template",
      icon: "bot",
    },
  },
};

describe("CreateWorkflowContent --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateWorkflowContent", () => {
    const { baseElement } = rtlRender(<CreateWorkflowContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
