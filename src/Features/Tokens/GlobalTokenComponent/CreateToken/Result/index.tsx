import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { ModalBody, ModalFooter, Button, TextInput, ModalFlowForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { CopyFile16 } from "@carbon/icons-react";
import styles from "./result.module.scss";

interface CreateServiceTokenResultProps {
  setShouldConfirmModalClose: (args: boolean) => void;
  formData: any;
  closeModal: () => void;
}

const CreateServiceTokenResult = (props: CreateServiceTokenResultProps | any) => {
  const handleCopyClick = () => {
    props.setShouldConfirmModalClose(false);
  };

  return (
    <ModalFlowForm>
      <ModalBody>
        <div className={styles.container}>
          <TextInput
            id="service-token"
            labelText="Global Token"
            className={styles.token}
            value={props.formData.token}
          />
          <p className={styles.saveText}>
            This is your unique global token and it is not-recoverable. If you lose this global token you will have to
            delete it and create another one.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button type="button" kind="secondary" onClick={props.closeModal}>
          Done
        </Button>
        <CopyToClipboard text={props.formData.token}>
          <Button type="button" onClick={handleCopyClick} renderIcon={CopyFile16} iconDescription="Copy">
            Copy
          </Button>
        </CopyToClipboard>
      </ModalFooter>
    </ModalFlowForm>
  );
};

export default CreateServiceTokenResult;
