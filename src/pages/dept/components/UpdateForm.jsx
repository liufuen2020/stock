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
import { asynchTree } from '@/services/ant-design-pro/api';
import { addField, upadataField, getDetail } from '../api';
import { getSysDeptTreelist } from '../../UserList/api';

import styles from '../index.less';

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, type, sysDeptData, asynchTreeData } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 部门tree
  const [deptData, setDeptData] = useState();
  const [deptValue, setDeptValue] = useState();
  // 区域 tree
  const [areaData, setAreaData] = useState([]);
  const [areaValue, setAreaValue] = useState();

  // 详情
  const getDetailData = () => {
    getDetail(data.deptId).then(res => {
      if (res.code === 0) {
        form.setFieldsValue({ ...res.data, ...data });
        setDeptValue(res.data.parentId || '');
      } else {
        message.error(res.msg || '获取详情失败');
      }
    });
  };

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  const setTreeFormat = datas => {
    const newData = [];
    datas.map(item => {
      const obj = {
        id: item.deptId,
        value: item.deptId,
        pId: item.parentId,
        title: item.deptName,
        isLeaf: !item.parentNode,
      };
      newData.push(obj);
      return '';
    });
    return newData;
  };

  const setAreaTreeFormat = datas => {
    const newData = [];
    datas.map(item => {
      const obj = {
        id: item.branchCode,
        value: item.branchCode,
        pId: item.parentCode,
        title: item.branchName,
        isLeaf: !item.parentNode,
      };
      newData.push(obj);
      return '';
    });
    return newData;
  };

  useEffect(() => {
    setDeptData(sysDeptData);
    setAreaValue(setAreaTreeFormat(asynchTreeData));
    if (type === 'updata' && visible === true) {
      getDetailData();
    } else {
      form.resetFields();
      setDeptValue('');
    }
  }, [visible]);

  // 填充字段数据  部门 ---------------------------------------------------------------------------------------
  const onLoadData = ({ id }) =>
    getSysDeptTreelist({ deptId: id }).then(res => {
      if (res.code === 0) {
        setDeptData(deptData.concat(setTreeFormat(res.data)));
      }
    });
  const treeDataChange = value => {
    setDeptValue(value);
  };
  const tProps = {
    treeData: deptData && deptData.length ? deptData : sysDeptData,
    value: deptValue,
    onChange: value => {
      treeDataChange(value);
    },
    placeholder: '',
    style: {
      width: '100%',
    },
  };

  //-------------------------------------------------------------------------

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
      const msg = await upadataField({
        ...values,
        deptId: data.deptId,
        parentId: deptValue,
        branch_code: areaValue,
      });
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
   * @zh-CN 添加部门
   *
   * @param values
   */
  const addData = async values => {
    const hide = message.loading('正在添加');

    try {
      const msg = await addField({ ...values, parentId: deptValue, branch_code: areaValue });
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
  // ------------------------------区域tree -----------------------

  const areaOnLoadData = ({ id }) =>
    asynchTree({ branchCode: id }).then(res => {
      if (res.code === 0) {
        setAreaData(areaData.concat(setAreaTreeFormat(res.data)));
      }
    });

  const areaTreeDataChange = value => {
    setAreaValue(value);
  };

  const areaTProps = {
    treeData: areaData && areaData.length ? areaData : setAreaTreeFormat(asynchTreeData),
    value: areaValue,
    onChange: value => {
      areaTreeDataChange(value);
    },
    placeholder: '',
    style: {
      width: '100%',
    },
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
          <div className={styles.treeBox}>
            <Row>
              <Col span={14} push={4}>
                {visible && sysDeptData && sysDeptData.length && (
                  <TreeSelect {...tProps} treeDataSimpleMode loadData={obj => onLoadData(obj)} />
                )}
              </Col>
              <Col span={4} pull={14}>
                <div className={styles.treeName}>上级部门：</div>
              </Col>
            </Row>
          </div>

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
          {visible && (
            <div className={styles.treeBox}>
              <Row>
                <Col span={14} push={4}>
                  <TreeSelect
                    {...areaTProps}
                    treeDataSimpleMode
                    loadData={obj => areaOnLoadData(obj)}
                  />
                </Col>
                <Col span={4} pull={14}>
                  <div className={styles.treeName}>选择区域：</div>
                </Col>
              </Row>
            </div>
          )}
          <Form.Item name="status" label="部门状态">
            <Radio.Group>
              <Radio value={1}>正常</Radio>
              <Radio value={2}>停用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateForm;
