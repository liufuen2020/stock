import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message, Space, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import Local from '@/utils/local';
import CryptoJS from 'crypto-js';

import { login, getCaptcha } from '@/services/ant-design-pro/api';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const [captchaObj, setCaptchaObj] = useState({ uuid: '', image: '' });

  const key = CryptoJS.enc.Utf8.parse('113813559663B1D1'); // 十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse(''); // 十六位

  // 加密方法
  const Encrypt = word => {
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString();
  };

  // 验证码
  const getCaptchaData = () => {
    getCaptcha().then(res => {
      if (res.code === 0) {
        setCaptchaObj(res.data);
      } else {
        message.error(res.msg || '获取验证码失败');
      }
    });
  };

  useEffect(() => {
    getCaptchaData();
  }, []);

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState(s => ({ ...s, currentUser: userInfo }));
    }
  };

  const fetchRoutes = async () => {
    const routeList = await initialState?.fetchCurrentRoute?.();
    if (routeList) {
      await setInitialState(s => ({ ...s, currentRoute: routeList }));
    }
  };

  const fetchDictDatas = async () => {
    const dictData = await initialState?.fetchDictData?.();
    if (dictData) {
      Local.set('dictData', dictData);
      await setInitialState(s => ({ ...s, dictData }));
    }
  };
  const handleSubmit = async values => {
    setSubmitting(true);
    try {
      // 登录
      const payload = {
        appId: '',
        uuid: captchaObj.uuid,
        captcha: values.captcha,
        // password: Encrypt(values.password),
        // userName: Encrypt(values.userName),
        password: values.password,
        userName: values.userName,
      };
      const msg = await login({ ...payload, type });
      if (msg.code === 0 && msg.data) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });

        message.success(defaultLoginSuccessMessage);

        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (history) {
          const { query } = history.location;
          const { redirect } = query;
          Local.set('token', msg.data);

          // 获取用户信息
          await fetchUserInfo();
          await fetchRoutes();
          await fetchDictDatas();

          setTimeout(() => {
            window.location.href = redirect || '/';
          }, 50);
        }
      } else {
        message.error(msg.msg || '登录失败，请检查密码账号');
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }

    setSubmitting(false);
  };

  const { status, type: loginType } = {};

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async values => {
              handleSubmit(values);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              {/* <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                })}
              /> */}
              {/* <Tabs.TabPane
                key="mobile"
                tab={intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                })}
              /> */}
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误(admin/ant.design)',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="userName"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="请输入用户名"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
                <Space style={{ alignItems: 'top' }}>
                  <ProFormText
                    name="captcha"
                    fieldProps={{
                      size: 'large',
                    }}
                    width={160}
                    placeholder="验证码！"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码',
                      },
                    ]}
                  />
                  {captchaObj && captchaObj.image && (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={`data:image/gif;base64,${captchaObj.image}`}
                      onClick={getCaptchaData}
                      style={{ height: 40, marginBottom: 24 }}
                    />
                  )}
                </Space>
              </>
            )}

            {/* <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div> */}
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
