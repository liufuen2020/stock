import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, TreeSelect } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { cmsColumnTree } from '../../column/api';
import styles from '../index.less';

const setColumnTreeFormat = datas => {
  const newData = [];
  datas.map(item => {
    const obj = {
      id: item.columnId,
      value: item.columnId,
      pId: item.parentId,
      title: item.columnName,
      isLeaf: item.parentNode,
    };
    newData.push(obj);
    return '';
  });
  return newData;
};

const ArticleRelease = () => {
  const [BraftEditorValue, setBraftEditorValue] = useState();

  const handleChange = value => {
    setBraftEditorValue(value.toHTML());
  };
  const [form] = Form.useForm();
  const [columnTreeData, setColumnTreeData] = useState(); // setColumnTreeData
  const [columnTreeValue, setColumnTreeValue] = useState();

  const getColumnTreeData = id => {
    cmsColumnTree({ columnId: id }).then(res => {
      if (res.code === 0) {
        setColumnTreeData(setColumnTreeFormat(res.data));
      }
    });
  };

  useEffect(() => {
    getColumnTreeData();
  }, []);

  // ------------------------------columntree -----------------------

  const columnOnLoadData = ({ id }) =>
    cmsColumnTree({ columnId: id }).then(res => {
      if (res.code === 0) {
        setColumnTreeData(columnTreeData.concat(setColumnTreeFormat(res.data)));
      }
    });

  const areaTreeDataChange = value => {
    setColumnTreeValue(value);
  };

  const columnTProps = {
    treeData: columnTreeData,
    value: columnTreeValue,
    onChange: value => {
      areaTreeDataChange(value);
    },
    placeholder: '',
    style: {
      width: '100%',
    },
  };

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  return (
    <PageContainer>
      <div className="gwrap">
        <Form {...formItemLayout} name="control-ref" form={form}>
          <div className={styles.treeBox}>
            <Row>
              <Col span={14} push={4}>
                <TreeSelect
                  {...columnTProps}
                  treeDataSimpleMode
                  loadData={obj => columnOnLoadData(obj)}
                  allowClear
                />
              </Col>
              <Col span={4} pull={14}>
                <div className={styles.treeName}>文章栏目：</div>
              </Col>
            </Row>
          </div>
          <div className={styles.treeBox}>
            <Row>
              <Col span={14} push={4}>
                <TreeSelect
                  {...columnTProps}
                  treeDataSimpleMode
                  loadData={obj => columnOnLoadData(obj)}
                  allowClear
                />
              </Col>
              <Col span={4} pull={14}>
                <div className={styles.treeName}>文章栏目：</div>
              </Col>
            </Row>
          </div>
          <Form.Item label="字典名称" name="dictLabel" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>{' '}
          <Form.Item label="字典值" name="dictValue" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>{' '}
          <Form.Item label="字典类型" name="dictType" rules={[{ required: true }]}>
            <Input maxLength={20} />
          </Form.Item>
          <div className={styles.treeBox}>
            <Row>
              <Col span={14} push={4}>
                <BraftEditor
                  className={styles.myEditor}
                  value={BraftEditorValue}
                  // controls={controls}
                  placeholder="请输入正文内容"
                  onChange={handleChange}
                  // media={{ uploadFn: myUploadFn }}
                />
              </Col>
              <Col span={4} pull={14}>
                <div className={styles.treeName}>发布文章：</div>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </PageContainer>
  );
};

export default ArticleRelease;
