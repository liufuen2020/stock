import React, { useState, useEffect } from 'react';
import { message, Drawer, Form, Input, Button, Row, Col, TreeSelect } from 'antd';
import { addField, upadataField } from '../api';
import { columnTree } from '../../release/api';
import { cmsSiteTree } from '../../site/api';
import styles from '../index.less';

/**
 * @zh-CN 栏目
 *
 * @param arr
 */

const setColumnTreeFormat = arr => {
  if (!arr || (arr && arr.length === 0)) return [];
  const newTreeData = [];
  arr.map(res => {
    const obj = {
      title: res.columnName,
      value: res.columnId,
      key: res.columnId,
    };

    if (res.children && res.children.length) {
      obj.children = setColumnTreeFormat(res.children);
    }
    newTreeData.push(obj);
    return '';
  });
  return newTreeData;
};

/**
 * @zh-CN 站点树结构
 *
 * @param datas
 */
const setSiteTreeFormat = datas => {
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
  const { visible, onCancel, onSuccess, data, type, siteTreeData } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [treeDatas, setTreeDatas] = useState();
  const [treeValue, setTreeValue] = useState();

  const [siteTreeDatas, setSiteTreeDatas] = useState([]); //  站点树处理
  const [site, setSite] = useState(); //  站点树处理

  // 详情
  const getDetailData = () => {
    form.setFieldsValue({ ...data });
    setTreeValue(data.parentId);
  };

  useEffect(() => {
    setSiteTreeDatas(setSiteTreeFormat(siteTreeData));
    setSite();
    setTreeValue();
    form.setFieldsValue({ audit: 0 });
    if (type === 'updata' && visible === true) {
      getDetailData();
    } else {
      setTreeValue('');
      form.resetFields();
      form.setFieldsValue({ audit: 0 });
    }
  }, [visible]);

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  const siteOnChange = value => {
    setLoading(true);
    setSite(value);
    setTreeDatas([]);
    setTreeValue('');
    columnTree(value).then(res => {
      setLoading(false);
      if (res.code === 0) {
        const newArr = (res.data && [res.data]) || [];
        setTreeDatas(setColumnTreeFormat(newArr));
      } else {
        message.error(res.msg || '栏目请求失败，请重试');
      }
    });
  };

  const siteOnLoadData = ({ id }) => {
    return cmsSiteTree({ siteId: id }).then(res => {
      if (res.code === 0 && res.data && res.data.length) {
        const newSite = siteTreeDatas.concat(setSiteTreeFormat(res.data));
        setSiteTreeDatas(newSite);
      }
    });
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
    upadataField({ ...values, columnId: data.columnId, parentId: treeValue, siteId: [site] }).then(
      res => {
        hide();
        setLoading(false);
        if (res.code === 0) {
          onCancel(false);
          onSuccess();
        } else {
          message.error(res.msg || '修改失败，请重试');
        }
      },
    );
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

    addField({ ...values, parentId: treeValue, siteId: [site] }).then(res => {
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

  // const areaOnLoadData = ({ id }) =>
  //   cmsColumnTree({ columnId: id }).then(res => {
  //     if (res.code === 0) {
  //       setTreeData(treeData.concat(setAreaTreeFormat(res.data)));
  //     }
  //   });

  const areaTreeDataChange = value => {
    setTreeValue(value);
  };

  const areaTProps = {
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
                    treeData={siteTreeDatas}
                    onChange={(value, label, extra) => {
                      siteOnChange(value, label, extra);
                    }}
                    treeDataSimpleMode
                    placeholder="选择站点"
                    loadData={obj => siteOnLoadData(obj)}
                    style={{ width: 200 }}
                    allowClear
                  />
                </Col>
                <Col span={4} pull={14}>
                  <div className={styles.treeName}>选择站点：</div>
                </Col>
              </Row>
            </div>
          )}
          <div className={styles.treeBox}>
            <Row>
              <Col span={14} push={4}>
                <TreeSelect
                  {...areaTProps}
                  treeData={treeDatas}
                  allowClear
                  placeholder="选择栏目"
                />
              </Col>
              <Col span={4} pull={14}>
                <div className={styles.treeName}>父级栏目：</div>
              </Col>
            </Row>
          </div>
          <Form.Item label="栏目名称" name="columnName" rules={[{ required: true }]}>
            <Input maxLength={20} allowClear />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateForm;
