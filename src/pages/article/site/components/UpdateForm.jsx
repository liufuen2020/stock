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
import { addField, upadataField, cmsSiteTree } from '../api';
import styles from '../index.less';

const setAreaTreeFormat = datas => {
  const newData = [];
  datas.map(item => {
    const obj = {
      id: item.siteId,
      value: item.siteId,
      pId: item.parentId,
      title: item.siteName,
      isLeaf: !item.parentNode,
    };
    newData.push(obj);
    return '';
  });
  return newData;
};

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, type, indexTreeData } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState([]);
  const [treeValue, setTreeValue] = useState();

  // 详情
  const getDetailData = () => {
    form.setFieldsValue({ ...data });
  };

  useEffect(() => {
    setTreeData(setAreaTreeFormat(indexTreeData));
    if (type === 'updata' && visible === true) {
      getDetailData();
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
    upadataField({ ...values, siteId: data.siteId, parentId: treeValue }).then(res => {
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

    addField({ ...values, parentId: treeValue }).then(res => {
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

  // ------------------------------tree -----------------------

  const areaOnLoadData = ({ id }) =>
    cmsSiteTree({ siteId: id }).then(res => {
      if (res.code === 0) {
        setTreeData(treeData.concat(setAreaTreeFormat(res.data)));
      }
    });

  const areaTreeDataChange = value => {
    setTreeValue(value);
  };

  const areaTProps = {
    treeData: treeData && treeData.length ? treeData : setAreaTreeFormat(indexTreeData),
    value: treeValue,
    onChange: value => {
      areaTreeDataChange(value);
    },
    placeholder: '',
    style: {
      width: '100%',
    },
  };

  //-------------------------------------------------------------------------

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
          {visible && (
            <div className={styles.treeBox}>
              <Row>
                <Col span={14} push={4}>
                  <TreeSelect
                    {...areaTProps}
                    treeDataSimpleMode
                    loadData={obj => areaOnLoadData(obj)}
                    allowClear
                  />
                </Col>
                <Col span={4} pull={14}>
                  <div className={styles.treeName}>父级类别：</div>
                </Col>
              </Row>
            </div>
          )}
          <Form.Item label="站点名称" name="siteName" rules={[{ required: true }]}>
            <Input maxLength={20} allowClear />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea maxLength={200} allowClear />
          </Form.Item>
          <Form.Item
            label="站点Url"
            rules={[
              { required: true },
              { type: 'url', warningOnly: true },
              { type: 'string', min: 6 },
            ]}
            name="siteUrl"
          >
            <Input maxLength={20} allowClear />
          </Form.Item>
          <Form.Item width="xs" name="orderNum" label="显示顺序" rules={[{ required: true }]}>
            <InputNumber min={0} max={1000} />
          </Form.Item>
          <Form.Item name="status" label="状态">
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
