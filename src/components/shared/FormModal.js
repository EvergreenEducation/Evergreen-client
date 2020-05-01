import React from 'react';
import { Modal } from 'antd';

export default function FormModal({
  visible,
  title,
  onCancel,
  FormComponent,
  role,
  providerId = null,
}) {
  return (
    <Modal
      className="custom-modal"
      title={title}
      visible={visible}
      onCancel={onCancel}
      style={{ borderRadius: 5 }}
      bodyStyle={{ backgroundColor: '#f0f2f5', padding: 0 }}
      width={998}
      footer={true}
      forceRender={true}
    >
      {visible && (
        <FormComponent
          closeModal={onCancel}
          role={role}
          providerId={providerId}
        />
      )}
    </Modal>
  );
}
