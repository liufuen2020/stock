import React, { useState } from 'react';
import { Upload, message, Modal } from 'antd';
import { request } from 'umi';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const UploadFileModal = props => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    action,
    onCancel,
    onSuccess,
    desText,
    onError,
    visible,
    params,
    fileType = '',
    num,
  } = props;

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: fileType,
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      if (fileList.length > num - 1) {
        message.warning(`只能选择${num}个文档上传`);
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warn('请先上传文件');
      return false;
    }
    const formData = new FormData();

    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });

    fileList.forEach(file => {
      formData.append('file', file);
    });

    setUploading(true);
    request(action, {
      method: 'POST',
      body: formData,
      customRes: true,
    }).then(res => {
      const { code } = res;
      if (code === 0) {
        onSuccess(res);
      } else {
        onError(res);
      }
      setFileList([]);
      setUploading(false);
    });
  };

  return (
    <Modal
      title="批量导入"
      visible={visible}
      onOk={handleUpload}
      onCancel={handleCancel}
      confirmLoading={uploading}
      okText="上传"
    >
      {desText === false ? '' : <p>导入文件时，相同数据将会覆盖当前数据</p>}

      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击此区域上传</p>
        {/* {fileType === 'pdf' ? (
          <p className="ant-upload-hint">仅支持.pdf后缀格式文件</p>
        ) : (
          <p className="ant-upload-hint">仅支持.xls、.xlsx后缀格式文件</p>
        )} */}
      </Dragger>
    </Modal>
  );
};

export default UploadFileModal;
