import React, { useState, useEffect } from 'react';
import { message, Modal, Form, Input, InputNumber, Row, Col, TreeSelect } from 'antd';
import { upadataRule, addRule, getRuleDetail } from '@/services/ant-design-pro/api';

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, menuData, type } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [tvalue, setTValue] = useState([]);

  const getDetail = () => {
    getRuleDetail(data.roleId).then(res => {
      if (res.code === 0) {
        setTValue(res.data.menuIds || []);
        form.setFieldsValue(res.data);
      } else {
        message.error(res.msg || '获取详情失败');
      }
    });
  };

  useEffect(() => {
    if (type === 'updata' && visible === true) {
      getDetail();
    } else {
      form.resetFields();
      setTValue([]);
    }
  }, [visible]);

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  // 填充字段数据

  const { SHOW_PARENT } = TreeSelect;
  const treeDataChange = value => {
    setTValue(value);
  };
  const tProps = {
    treeData: menuData,
    value: tvalue,
    onChange: value => {
      treeDataChange(value);
    },
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
  };

  /**
   * @en-US Update node
   * @zh-CN values
   *
   * @param fields
   */
  const updataData = values => {
    const hide = message.loading('正在添加');
    upadataRule({ ...values, roleId: data.roleId, menuIds: tvalue }).then(res => {
      hide();
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
    addRule({ ...values, menuIds: tvalue }).then(res => {
      hide();
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
      <Modal
        getContainer={false}
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        title="修改角色"
        visible={visible}
        onCancel={modelClose}
        maskClosable={false}
        onOk={sendData}
      >
        <Form {...formItemLayout} name="control-ref" form={form}>
          <Form.Item label="角色名称" name="roleName" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="权限字符串" name="roleKey" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item width="xs" name="roleSort" label="显示顺序" rules={[{ required: true }]}>
            <InputNumber min={0} max={1000} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateForm;
