import React, { useState, useEffect } from 'react';
import { message, Drawer, Form, Input, Button, Radio, Select, Row, Col, TreeSelect } from 'antd';
import { upadataUser, addUser, getUserDetail, getSysDeptTreelist } from '../api';

import styles from '../index.less';

const { Option } = Select;

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, roleList, sysPostList, data, type, sysDeptData } = props;

  console.log(sysDeptData);

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tvalue, setTValue] = useState();

  const [deptData, setDeptData] = useState();

  // 详情
  const getDetail = () => {
    getUserDetail(data.userId).then(res => {
      if (res.code === 0) {
        form.setFieldsValue({ ...res.data, ...data });
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
    }
  }, [visible]);

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
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
    upadataUser({ ...values, userId: data.userId }).then(res => {
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
    addUser({ ...values }).then(res => {
      setLoading(false);
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

  // 填充字段数据

  // const { SHOW_PARENT } = TreeSelect;
  const treeDataChange = value => {
    setTValue(value);
  };

  const setTreeFormat = datas => {
    const newData = [];
    datas.map(item => {
      const obj = {
        id: item.deptId,
        value: item.deptId,
        pId: item.parentId,
        title: item.deptName,
        isLeaf: false,
      };
      newData.push(obj);
      return '';
    });
    return newData;
  };

  const onLoadData = ({ id }) => {
    getSysDeptTreelist({ deptId: id }).then(res => {
      if (res.code === 0) {
        setDeptData(sysDeptData.concat(setTreeFormat(res.data)));
      }
      console.log(12333, sysDeptData.concat(setTreeFormat(res.data)));
    });
  };

  const tProps = {
    treeData: deptData && deptData.length ? deptData : sysDeptData,
    value: tvalue,
    onChange: value => {
      treeDataChange(value);
    },
    // treeCheckable: false,
    // showCheckedStrategy: SHOW_PARENT,
    placeholder: '',
    style: {
      width: '100%',
    },
    loadData: onLoadData,
  };
  // treeDataSimpleMode
  //       style={{ width: '100%' }}
  //       value={this.state.value}
  //       dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
  //       placeholder="Please select"
  //       onChange={this.onChange}
  //       loadData={this.onLoadData}
  //       treeData={treeData}
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
          <Form.Item label="用户昵称" name="nickName" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>{' '}
          <Form.Item label="头像" name="avatar">
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Radio.Group>
              <Radio value="0">男</Radio>
              <Radio value="1">女</Radio>
              <Radio value="2">未知</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="用户账号" name="userName" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item label="手机号" name="phonenumber">
            <Input maxLength={11} />
          </Form.Item>
          <Form.Item label="email" name="email">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="身份证号" name="idCard">
            <Input maxLength={18} />
          </Form.Item>
          <Form.Item name="roleIds" label="选择角色">
            <Select mode="multiple" placeholder="选择角色">
              {roleList &&
                roleList.map(item => {
                  return (
                    <Option value={item.roleId} key={item.roleId}>
                      {item.roleName}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item name="postIds" label="选择岗位">
            <Select mode="multiple" placeholder="选择岗位">
              {sysPostList &&
                sysPostList.map(item => {
                  return (
                    <Option value={item.postId} key={item.postId}>
                      {item.postName}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          {sysDeptData && sysDeptData.length && (
            <div className={styles.treeBox}>
              <Row>
                <Col span={14} push={4}>
                  <TreeSelect
                    {...tProps}
                    treeData={deptData && deptData.length ? deptData : sysDeptData}
                    treeDataSimpleMode
                  />
                </Col>
                <Col span={4} pull={14}>
                  <div className={styles.treeName}>选择部门：</div>
                </Col>
              </Row>
            </div>
          )}
          <Form.Item label="备注" name="remark">
            <Input.TextArea maxLength={200} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateForm;
