import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { sysUserList, removeRule } from '@/services/ant-design-pro/api';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const getSysUserList = async fields => {
  try {
    const data = await sysUserList({ ...fields });
    return { data: data.data.list };
  } catch (error) {
    message.error('请求失败，请重试');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList = () => {
  const actionRef = useRef();
  const [type, setType] = useState();

  // 更新数据 组件 ------------------------------------------------------------------

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [updataData, setUpdataData] = useState({});

  const closeUpdateForm = () => {
    handleUpdateModalVisible(false);
  };

  const setUpdateForm = param => {
    setType('updata');
    handleUpdateModalVisible(true);
    setUpdataData(param);
  };

  const updataSuccess = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns = [
    {
      title: '用户名',
      dataIndex: 'nickName',
    },
    {
      title: '账号',
      dataIndex: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phonenumber',
    },
    {
      title: 'email',
      dataIndex: 'email',
      valueType: 'option',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      valueType: 'option',
      render: (_, record) => {
        const text = (
          <>
            <Button type="link" onClick={() => setUpdateForm(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Button type="link" onClick={() => handleRemove(record.roleId)}>
              删除
            </Button>
          </>
        );
        return <>{text}</>;
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="表格查询"
        actionRef={actionRef}
        rowKey={record => record.userName}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleUpdateModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getSysUserList}
        columns={columns}
      />
      <UpdateForm
        visible={updateModalVisible}
        onCancel={closeUpdateForm}
        data={updataData}
        onSuccess={updataSuccess}
        type={type}
      />
    </PageContainer>
  );
};

export default TableList;
