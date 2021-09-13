import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
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
  Modal,
} from 'antd';
import {
  CopyOutlined,
  SnippetsOutlined,
  FundOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import { addField, upadataField, getDetail } from '../api';

import styles from '../index.less';

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, type, menuData } = props;

  const [menuType, setMenuType] = useState('M');

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tvalue, setTValue] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchRoutes = async () => {
    const routeList = await initialState?.fetchCurrentRoute?.();
    if (routeList) {
      await setInitialState(s => ({ ...s, currentRoute: routeList }));
    }
  };

  // 详情

  const getDetailData = () => {
    getDetail(data.menuId).then(res => {
      if (res.code === 0) {
        form.setFieldsValue({ ...res.data, ...data });
        setTValue(res.data.parentId || '');
        setMenuType(res.data.menuType);
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
      const msg = await upadataField({ ...values, menuId: data.menuId, parentId: tvalue });
      hide();
      setLoading(false);
      if (msg.code === 0) {
        onCancel(false);
        onSuccess();
        message.success('修改成功');
        await fetchRoutes();
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
        await fetchRoutes();
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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const selectIconLayer = () => {
    setIsModalVisible(true);
  };

  const selectIcon = id => {
    form.setFieldsValue({ icon: id });
  };

  // 监听字段变化
  const formChange = value => {
    if (value.menuType) {
      setMenuType(value.menuType);
    }
  };

  return (
    <>
      <Drawer
        getContainer={false}
        width={640}
        title={type === 'updata' ? '修改菜单' : '添加菜单'}
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
        <Form {...formItemLayout} name="control-ref" form={form} onValuesChange={formChange}>
          {menuData && menuData.length && (
            <div className={styles.treeBox}>
              <Row>
                <Col span={14} push={4}>
                  <TreeSelect {...tProps} />
                </Col>
                <Col span={4} pull={14}>
                  <div className={styles.treeName}>选择菜单：</div>
                </Col>
              </Row>
            </div>
          )}
          <Form.Item label="菜单名称" name="menuName" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item name="menuType" label="菜单类型" rules={[{ required: true }]}>
            <Radio.Group>
              {/* <Radio value="M">目录</Radio> */}
              <Radio value="M">模块</Radio>
              <Radio value="C">菜单</Radio>
              <Radio value="F">按钮</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item width="xs" name="orderNum" label="显示顺序" rules={[{ required: true }]}>
            <InputNumber min={0} max={1000} />
          </Form.Item>

          <Form.Item label="权限字符" name="perms">
            <Input maxLength={20} />
          </Form.Item>

          {menuType === 'M' && (
            <Form.Item width="xs" name="icon" label="菜单图标" rules={[{ required: true }]}>
              <Input maxLength={20} readOnly="readonly" onClick={selectIconLayer} />
            </Form.Item>
          )}
          {menuType === 'C' && (
            <div>
              <Form.Item name="visible" label="显示状态">
                <Radio.Group>
                  <Radio value="0">显示</Radio>
                  <Radio value="1">隐藏</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="路由地址" name="path" rules={[{ required: true }]}>
                <Input maxLength={20} />
              </Form.Item>
              <Form.Item name="status" label="菜单状态">
                <Radio.Group>
                  <Radio value="0">正常</Radio>
                  <Radio value="1">停用</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="备注" name="remark">
                <Input.TextArea maxLength={200} />
              </Form.Item>
            </div>
          )}
        </Form>
      </Drawer>
      <Modal title="选择图标" visible={isModalVisible} onOk={handleCancel} onCancel={handleCancel}>
        <div className={styles.iconLayer}>
          <span>
            <CopyOutlined onClick={() => selectIcon('CopyOutlined')} />
          </span>
          <span>
            <SnippetsOutlined onClick={() => selectIcon('SnippetsOutlined')} />
          </span>
          <span>
            <FundOutlined onClick={() => selectIcon('FundOutlined')} />
          </span>
          <span>
            <AppstoreOutlined onClick={() => selectIcon('AppstoreOutlined')} />
          </span>
          <span>
            <CalendarOutlined onClick={() => selectIcon('CalendarOutlined')} />
          </span>
        </div>
      </Modal>
    </>
  );
};

export default UpdateForm;
