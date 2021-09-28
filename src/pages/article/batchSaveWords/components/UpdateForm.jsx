import React, { useState, useEffect } from 'react';
import { message, Drawer, Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import { addField, upadataField } from '../api';

const { RangePicker } = DatePicker;
const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, type } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 详情
  const getDetailData = () => {
    const time = [];
    if (data.startTime) time[0] = moment(data.startTime);
    if (data.endTime) time[1] = moment(data.endTime);
    form.setFieldsValue({ ...data, time });
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
    wrapperCol: { span: 16 },
  };

  /**
   * @en-US Update node
   * @zh-CN values
   *
   * @param fields
   */
  const updataData = values => {
    const hide = message.loading('正在添加');
    setLoading(true);
    const payload = {
      word: values.word,
      endTime: (values.time && values.time[0]) || '',
      startTime: (values.time && values.time[1]) || '',
    };
    upadataField({ ...payload, wordId: data.wordId }).then(res => {
      hide();
      setLoading(false);
      if (res.code === 0) {
        onCancel(false);
        onSuccess();
      } else {
        message.error(res.msg || '修改失败，请重试');
      }
    });
  };
  /**
   * @en-US Update node
   * @zh-CN 添加角色
   *
   * @param values
   */
  const addData = values => {
    const hide = message.loading('正在添加');
    setLoading(true);
    const payload = {
      word: values.word,
      endTime: (values.time && values.time[0]) || '',
      startTime: (values.time && values.time[1]) || '',
    };
    addField({ ...payload }).then(res => {
      hide();
      setLoading(false);
      if (res.code === 0) {
        onCancel(false);
        onSuccess();
      } else {
        message.error(res.msg || '添加失败，请重试');
      }
    });
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param values
   */
  const sendData = () => {
    form.validateFields().then(values => {
      if (type === 'updata') updataData(values);
      if (type === 'add') addData(values);
    });
  };

  const modelClose = () => {
    onCancel(false);
  };

  return (
    <>
      <Drawer
        getContainer={false}
        width={640}
        title={type === 'updata' ? '修改' : '添加'}
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
            <Button onClick={sendData} type="primary" loading={loading} disabled={loading}>
              保存
            </Button>
          </div>
        }
      >
        <Form {...formItemLayout} name="control-ref" form={form}>
          <Form.Item label="敏感词名称" name="word" rules={[{ required: true }]}>
            <Input maxLength={20} allowClear />
          </Form.Item>
          <Form.Item name="time" label="时效性">
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateForm;
