import React, { useState, useEffect } from 'react';
import {
  message,
  Drawer,
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  Row,
  Col,
  TreeSelect,
} from 'antd';

import { addField, upadataField, getDetail } from '../api';

import styles from '../index.less';

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, type, menuData, asynchTreeData } = props;

  console.log(123, asynchTreeData);
  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tvalue, setTValue] = useState();

  // 详情

  const getDetailData = () => {
    getDetail(data.deptId).then(res => {
      if (res.code === 0) {
        form.setFieldsValue({ ...res.data, ...data });
        setTValue(res.data.parentId || '');
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
      setTValue('');
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
    treeCheckable: false,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '',
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
  const updataData = async values => {
    const hide = message.loading('正在添加');
    setLoading(true);
    try {
      const msg = await upadataField({ ...values, deptId: data.deptId, parentId: tvalue });
      hide();
      setLoading(false);
      if (msg.code === 0) {
        onCancel(false);
        onSuccess();
        message.success('修改成功');
      } else {
        message.error(msg.msg || '修改失败，请重试');
      }
      return true;
    } catch (error) {
      hide();
      setLoading(false);
      onCancel(false);
      message.error('修改失败，请重试');
      return false;
    }
  };
  /**
   * @en-US Update node
   * @zh-CN 添加角色
   *
   * @param values
   */
  const addData = async values => {
    const hide = message.loading('正在添加');

    try {
      const msg = await addField({ ...values, parentId: tvalue });
      hide();
      setLoading(false);
      if (msg.code === 0) {
        message.success('修改成功');
        onSuccess();
        onCancel(false);
      } else {
        message.error(msg.msg || '修改失败，请重试');
      }
      return true;
    } catch (error) {
      hide();
      setLoading(false);
      onCancel(false);
      message.error('修改失败，请重试');
      return false;
    }
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

  // const onChange = value => {
  //   console.log(value);
  // };

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
          {menuData && menuData.length && (
            <div className={styles.treeBox}>
              <Row>
                <Col span={14} push={4}>
                  <TreeSelect {...tProps} />
                </Col>
                <Col span={4} pull={14}>
                  <div className={styles.treeName}>
                    <span>*</span>选择部门：
                  </div>
                </Col>
              </Row>
            </div>
          )}
          {/* <TreeSelect
            treeDataSimpleMode
            style={{ width: '100%' }}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            onChange={onChange}
            loadData={this.onLoadData}
            treeData={treeData}
          /> */}

          <Form.Item label="部门名称" name="deptName" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="负责人" name="leader" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input maxLength={11} />
          </Form.Item>
          <Form.Item label="email" name="email">
            <Input maxLength={11} />
          </Form.Item>
          <Form.Item width="xs" name="orderNum" label="显示顺序" rules={[{ required: true }]}>
            <InputNumber min={0} max={1000} />
          </Form.Item>

          <Form.Item name="status" label="部门状态">
            <Radio.Group>
              <Radio value={0}>正常</Radio>
              <Radio value={1}>停用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateForm;
