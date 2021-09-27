import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
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
    if (data && data.code === 0 && data.data.list) {
      return { data: data.data.list, total: data.data.total };
    }
    message.error(data.msg || '请求失败，请重试');
    return;
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
      const msg = await removeField(id);
      hide();
      if (msg.code === 0) {
        message.success('删除成功！');
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      }
      message.error(msg.msg || '删除失败，请重试');
      return false;
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
      title: '序号',
      valueType: 'option',
      dataIndex: '',
      render(text, record, index) {
        // eslint-disable-next-line react/jsx-filename-extension
        return <span key={index}>{index + 1}</span>;
      },
    },
    {
      title: '敏感词',
      dataIndex: 'word',
    },
    {
      title: '开始生效时间		',
      dataIndex: 'startTime',
      valueType: 'option',
      render: (_, record) => {
        return <>{moment(record.startTime).format('YYYY-MM-DD HH:mm:ss')}</>;
      },
    },

    {
      title: '结束生效时间	',
      dataIndex: 'endTime',
      valueType: 'option',
      render: (_, record) => {
        return <>{moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')}</>;
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
              onConfirm={() => handleRemove(record.wordId)}
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
        rowKey={record => record.wordId}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={addUser}>
            <PlusOutlined /> 新建
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
