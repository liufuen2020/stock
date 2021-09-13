/* eslint-disable jsx-a11y/alt-text */
import { Button, message, Card, Row, Col, Tabs, Form, Input, Radio, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
// import moment from 'moment';
import local from '@/utils/local';
import { getList, upadataField, upadataPassword } from './api';
import styles from './index.less';

const { TabPane } = Tabs;
const TableList = () => {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetail] = useState({});
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [avatar, setAvatar] = useState();

  const [newAvatar, setNewAvatar] = useState();

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
        setNewAvatar(data.data.avatar);
        setAvatar(data.data.avatar);
      }
    } catch (error) {
      message.error('请求失败，请重试');
      return false;
    }
  };

  const sendData = () => {
    form.validateFields().then(values => {
      setLoading(true);
      const hide = message.loading('正在提交');
      upadataField({ ...values, avatar: newAvatar }).then(res => {
        hide();
        getData();
        setLoading(false);
        if (res.code === 0) {
          message.success('修改成功');
        }
      });
    });
  };

  const upadataPasswordData = () => {
    form2.validateFields().then(values => {
      setLoading(true);
      const hide = message.loading('正在提交');
      upadataPassword({ ...values }).then(res => {
        hide();
        getData();
        setLoading(false);
        if (res.code === 0) {
          message.success('修改成功');
        } else {
          message.error(res.msg || '修改失败，请重试');
        }
      });
    });
  };
  // 栅格化
  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 14 },
  };

  useEffect(() => {
    getData();
  }, []);

  const accessToken = local.get('token');

  const props = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    showUploadList: false,
    action: '/api/sysPerson/avatar',
    onChange: info => {
      setLoading(true);
      if (info.file && info.file.response && info.file.response.code === 0) {
        setLoading(false);
        setNewAvatar(info.file.response.data);
      }
    },
    multiple: true,
  };

  const avatarImg = `http://localhost:8088${avatar}`;
  const newAvatarImg = `http://localhost:8088${newAvatar}`;

  return (
    <PageContainer>
      <div className={styles.container}>
        <Row>
          <Col span={8}>
            <Card title="个人信息" style={{ width: '100%', border: 0 }} className={styles.cardOne}>
              <div className={styles.avatar}>
                <Button style={{ backgroundImage: `url(${avatarImg})` }}> </Button>
              </div>
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
                  <TabPane tab="修改信息" key="1" className="infoBox">
                    <Form {...formItemLayout} name="control-ref" form={form}>
                      <Form.Item label="用户昵称" name="nickName">
                        <Input maxLength={20} />
                      </Form.Item>
                      <div className={styles.avatar2}>
                        <Upload {...props}>
                          <Button
                            loading={loading}
                            style={{ backgroundImage: `url(${newAvatarImg})` }}
                          >
                            {' '}
                          </Button>
                        </Upload>
                      </div>
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
                    <Button type="primary" onClick={sendData} loading={loading}>
                      提交
                    </Button>
                  </TabPane>
                  <TabPane tab="修改密码" key="2">
                    <Form {...formItemLayout} name="control-ref" form={form2}>
                      <Form.Item label="原密码" name="newPassword" rules={[{ required: true }]}>
                        <Input maxLength={20} type="password" placeholder="输入旧密码" />
                      </Form.Item>
                      <Form.Item label="新密码" name="oldPassword" rules={[{ required: true }]}>
                        <Input maxLength={20} type="password" placeholder="输入新密码" />
                      </Form.Item>
                      <Form.Item
                        label="确认密码"
                        name="repeatPassword"
                        rules={[{ required: true }]}
                      >
                        <Input maxLength={20} type="password" placeholder="输入确认新密码" />
                      </Form.Item>
                      <Button type="primary" onClick={upadataPasswordData} loading={loading}>
                        提交
                      </Button>
                    </Form>
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
