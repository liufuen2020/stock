import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { getList, removeField } from './api';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const getListData = async fields => {
  try {
    const data = await getList({ ...fields });
    if (data.code === 0) {
      return { data: data.data.list, total: data.data.total };
    }
  } catch (error) {
    message.error('请求失败，请重试');
    return false;
  }
};

const TableList = () => {
  const actionRef = useRef();

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async id => {
    const hide = message.loading('正在删除');

    try {
      await removeField(id);
      hide();
      message.success('删除成功！');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  useEffect(() => {}, []);

  // 更新数据 组件 ------------------------------------------------------------------

  const [type, setType] = useState();

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

  // 添加角色
  const addUser = () => {
    setType('add');
    setUpdataData({});
    handleUpdateModalVisible(true);
  };
  // ----------------------------------------------结束------------------------------------------------------

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns = [
    {
      title: '岗位名称',
      dataIndex: 'postName',
    },
    {
      title: '岗位状态',
      dataIndex: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (_, record) => {
        return <>{moment(record.createTime).format('YYYY-MM-DD')}</>;
      },
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
            <Popconfirm
              placement="topRight"
              title="确实要删除此条信息吗？"
              onConfirm={() => handleRemove(record.postId)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
        return <>{text}</>;
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey={record => record.postId}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={addUser}>
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getListData}
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
