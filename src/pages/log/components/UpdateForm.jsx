import React, { useEffect } from 'react';
import { message, Drawer, Form, Input, Button } from 'antd';
import { getDetail } from '../api';

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, data, type } = props;

  // 初始化 form
  const [form] = Form.useForm();

  // 详情
  const getDetailData = () => {
    getDetail(data.id).then(res => {
      if (res.code === 0) {
        form.setFieldsValue({ ...res.data, ...data });
      } else {
        message.error(res.msg || '获取详情失败');
      }
    });
  };

  useEffect(() => {
    if (type === 'updata' && visible === true) {
      getDetailData();
    } else {
      form.resetFields();
    }
  }, [visible]);

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const modelClose = () => {
    onCancel(false);
  };

  return (
    <>
      <Drawer
        getContainer={false}
        width={640}
        title="详情"
        visible={visible}
        onClose={modelClose}
        maskClosable={false}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={modelClose} style={{ marginRight: 10 }}>
              取消
            </Button>
          </div>
        }
      >
        <Form {...formItemLayout} name="control-ref" form={form}>
          <Form.Item label="methodTarget" name="methodTarget">
            <Input.TextArea maxLength={400} rows={3} />
          </Form.Item>
          <Form.Item label="param" name="param">
            <Input.TextArea maxLength={400} rows={6} />
          </Form.Item>
          <Form.Item label="result" name="result">
            <Input.TextArea maxLength={400} rows={3} />
          </Form.Item>
          <Form.Item label="errorMsg" name="errorMsg">
            <Input.TextArea maxLength={400} rows={3} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateForm;
