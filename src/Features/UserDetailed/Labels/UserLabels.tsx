import React from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useMutation, useQueryClient } from "react-query";
import ms from "match-sorter";
import sortBy from "lodash/sortBy";
import { Formik, FieldArray } from "formik";
import {
  Button,
  Search,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyState from "Components/EmptyState";
import LabelModal from "Components/LabelModal";
import { serviceUrl } from "Config/servicesConfig";
import { Add16, Edit16, Save16, TrashCan16 } from "@carbon/icons-react";
import { FlowUser } from "Types";
import styles from "./UserLabels.module.scss";

interface UserLabelsProps {
  user: FlowUser;
  userManagementEnabled?: any;
}

interface Label {
  key: string;
  value: string;
}

function UserLabels({ user, userManagementEnabled }: UserLabelsProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { mutateAsync: changeUserMutator, isLoading } = useMutation(
    ({ userId, body }: any) => axios.patch(serviceUrl.resourceManageUser({ userId }), body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(serviceUrl.resourceManageUser({ userId: user.id }));
      },
    }
  );

  const handleSubmit = async (values: any) => {
    try {
      await changeUserMutator({ body: values, userId: user.id });
      notify(
        <ToastNotification
          kind="success"
          title="User Labels Saved"
          subtitle={`Successfully saved labels for ${user.name}.`}
        />
      );
    } catch (error) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle={`Request to save labels failed.`} />);
    }
  };

  return (
    <section aria-label={`${user.name} Labels`} className={styles.container}>
      <Helmet>
        <title>{`Labels - ${user.name}`}</title>
      </Helmet>
      <Formik initialValues={{ labels: user.labels ?? [] }} onSubmit={handleSubmit}>
        {(formikProps) => {
          const { values, handleSubmit, dirty } = formikProps;
          const userLabels = values.labels;

          const filteredLabelsList = searchQuery ? ms(userLabels, searchQuery, { keys: ["key", "value"] }) : userLabels;

          const labelsKeys = values.labels?.map((label) => label.key) ?? [];

          return (
            <FieldArray
              name="labels"
              render={(arrayHelpers) => {
                return (
                  <>
                    <section className={styles.actionsContainer}>
                      <div className={styles.leftActions}>
                        <p className={styles.featureDescription}>{`These are ${user.name}'s labels`}</p>
                        <p className={styles.labelsCountText}>
                          Showing {filteredLabelsList.length} label{filteredLabelsList.length !== 1 ? "s" : ""}
                        </p>
                        <Search
                          labelText="labels search"
                          id="labels-search"
                          placeHolderText="Search for a label"
                          onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
                        />
                      </div>
                      {userManagementEnabled && (
                        <div className={styles.rightActions}>
                          <Button
                            disabled={!dirty || isLoading}
                            iconDescription="save labels"
                            renderIcon={Save16}
                            size="field"
                            onClick={handleSubmit}
                          >
                            {isLoading ? "Saving..." : "Save"}
                          </Button>
                          <LabelModal
                            action={(label: Label) => arrayHelpers.push(label)}
                            labelsKeys={labelsKeys}
                            modalTrigger={({ openModal }: { openModal: Function }) => (
                              <Button
                                kind="secondary"
                                iconDescription="add a new label"
                                renderIcon={Add16}
                                size="field"
                                onClick={openModal}
                              >
                                Add a new label
                              </Button>
                            )}
                          />
                        </div>
                      )}
                    </section>
                    {filteredLabelsList.length > 0 ? (
                      <StructuredListWrapper>
                        <StructuredListHead>
                          <StructuredListRow head>
                            <StructuredListCell head>Key</StructuredListCell>
                            <StructuredListCell head>Value</StructuredListCell>
                            <StructuredListCell head />
                            <StructuredListCell head />
                          </StructuredListRow>
                        </StructuredListHead>
                        <StructuredListBody>
                          {sortBy(filteredLabelsList, "key").map((label) => {
                            const labelIndex = values.labels.findIndex(
                              (labelFromList) => labelFromList.key === label.key
                            );
                            return (
                              <StructuredListRow key={label.key}>
                                <StructuredListCell className={styles.labelKeyCell}>{label.key}</StructuredListCell>
                                <StructuredListCell>{label.value}</StructuredListCell>
                                {userManagementEnabled && (
                                  <>
                                    <StructuredListCell>
                                      <LabelModal
                                        action={(label: Label) => arrayHelpers.replace(labelIndex, label)}
                                        isEdit
                                        labelsKeys={labelsKeys.filter((labelKey) => labelKey !== label.key)}
                                        selectedLabel={label}
                                        modalTrigger={({ openModal }: { openModal: Function }) => (
                                          <Button
                                            kind="ghost"
                                            iconDescription="edit label"
                                            renderIcon={Edit16}
                                            size="small"
                                            onClick={openModal}
                                          >
                                            Edit
                                          </Button>
                                        )}
                                      />
                                    </StructuredListCell>
                                    <StructuredListCell>
                                      <Button
                                        kind="danger--ghost"
                                        iconDescription="delete label"
                                        renderIcon={TrashCan16}
                                        size="small"
                                        onClick={() => arrayHelpers.remove(labelIndex)}
                                      >
                                        Delete
                                      </Button>
                                    </StructuredListCell>
                                  </>
                                )}
                              </StructuredListRow>
                            );
                          })}
                        </StructuredListBody>
                      </StructuredListWrapper>
                    ) : (
                      <EmptyState />
                    )}
                  </>
                );
              }}
            />
          );
        }}
      </Formik>
    </section>
  );
}

export default UserLabels;
