import React, { useState, useEffect } from 'react';
import {
  message,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  TreeSelect,
  Drawer,
  Button,
  Radio,
} from 'antd';
import { upadataRule, addRule, getRuleDetail } from '@/services/ant-design-pro/api';
import styles from '../index.less';

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, menuData, type } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [tvalue, setTValue] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDetail = () => {
    getRuleDetail(data.roleId).then(res => {
      if (res.code === 0) {
        const menuIds = res.data.menuIds || [];
        menuIds.map((item, index) => {
          menuData.map(items => {
            if (item === items.key && items.children && items.children.length > 0) {
              menuIds.splice(index, 1);
            }
            return '';
          });
          return '';
        });
        setTValue(menuIds || []);
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
    placeholder: '',
    style: {
      width: '100%',
    },
  };

  // 提交时候 数据菜单处理
  const setTreeData = tvalues => {
    const newTreeD = [];
    menuData.map(item => {
      if (tvalues.indexOf(item.value) > -1 && item.children && item.children.length) {
        item.children.map(items => {
          newTreeD.push(items.key);
          return '';
        });
      } else if (item.children && item.children.length) {
        item.children.map(items => {
          if (tvalues.indexOf(items.key) > -1) {
            newTreeD.push(item.key);
          }
          return '';
        });
      }
      return '';
    });
    return newTreeD;
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

    upadataRule({
      ...values,
      roleId: data.roleId,
      // eslint-disable-next-line compat/compat
      menuIds: Array.from(new Set(setTreeData(tvalue).concat(tvalue))),
    }).then(res => {
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

    // eslint-disable-next-line compat/compat
    addRule({ ...values, menuIds: Array.from(new Set(setTreeData(tvalue).concat(tvalue))) }).then(
      res => {
        hide();
        setLoading(false);
        if (res.code === 0) {
          onCancel(false);
          onSuccess();
        } else {
          message.error(res.msg || '添加失败，请重试');
        }
      },
    );
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param values
   */
  const sendData = () => {
    // setNewTvalue(setTreeData(tvalue).concat(tvalue));
    // console.log(123, setTreeData(tvalue).concat(tvalue));
    // return;
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
          <Form.Item label="角色名称" name="roleName" rules={[{ required: true }]}>
            <Input maxLength={20} allowClear />
          </Form.Item>
          <Form.Item label="角色字符串" name="roleKey" rules={[{ required: true }]}>
            <Input maxLength={20} allowClear />
          </Form.Item>
          <Form.Item width="xs" name="roleSort" label="显示顺序" rules={[{ required: true }]}>
            <InputNumber min={0} max={1000} />
          </Form.Item>
          <div className={styles.treeBox}>
            <Row>
              <Col span={14} push={4}>
                <TreeSelect {...tProps} allowClear />
              </Col>
              <Col span={4} pull={14}>
                <div className={styles.treeName}>选择菜单：</div>
              </Col>
            </Row>
          </div>
          <Form.Item name="status" label="状态">
            <Radio.Group>
              <Radio value={0}>正常</Radio>
              <Radio value={1}>停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea maxLength={200} allowClear />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateForm;
