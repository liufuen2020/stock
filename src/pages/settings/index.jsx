import { Button, message, Card, Row, Col, Tabs, Form, Input, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
// import moment from 'moment';
import { getList } from './api';
import styles from './index.less';

const { TabPane } = Tabs;
const TableList = () => {
  const [detailData, setDetail] = useState({});
  const [form] = Form.useForm();

  /**
   * @zh-CN 详情
   * @param fields
   */

  const getData = async fields => {
    try {
      const data = await getList({ ...fields });
      if (data.code === 0) {
        form.setFieldsValue({ ...data.data });
        setDetail(data.data);
      }
    } catch (error) {
      message.error('请求失败，请重试');
      return false;
    }
  };

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 14 },
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer>
      <div className={styles.container}>
        <Row>
          <Col span={8}>
            <Card title="个人信息" style={{ width: '100%', border: 0 }} className={styles.cardOne}>
              <p>
                部门<span>{detailData.deptName || '--'}</span>
              </p>
              <p>
                昵称<span>{detailData.nickName || '--'}</span>
              </p>
              <p>
                手机号<span>{detailData.phonenumber || '--'}</span>
              </p>
              <p>
                Email<span>{detailData.email || '--'}</span>
              </p>
            </Card>
          </Col>
          <Col span={16}>
            <div style={{ paddingLeft: 20 }}>
              <Card title="基本资料" style={{ width: '100%' }}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="修改信息" key="1">
                    <Form {...formItemLayout} name="control-ref" form={form}>
                      <Form.Item label="用户昵称" name="nickName" rules={[{ required: true }]}>
                        <Input maxLength={20} />
                      </Form.Item>
                      <Form.Item name="gender" label="性别">
                        <Radio.Group>
                          <Radio value="1">男</Radio>
                          <Radio value="2">女</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label="手机号" name="phonenumber">
                        <Input maxLength={11} />
                      </Form.Item>
                      <Form.Item label="email" name="email">
                        <Input maxLength={100} />
                      </Form.Item>
                    </Form>
                    <Button type="primary"> 提交</Button>
                  </TabPane>
                  <TabPane tab="修改密码" key="2">
                    Content of Tab Pane 2
                  </TabPane>
                </Tabs>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default TableList;
