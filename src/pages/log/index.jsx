import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { formatDict } from '@/utils';
import { getList } from './api';
import UpdateForm from './components/UpdateForm';

const TableList = () => {
  const actionRef = useRef();

  const Model = useModel('@@initialState');
  const dictData = Model.initialState?.dictData;

  const [logDictData, setLogDictData] = useState();

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */

  const getListData = async fields => {
    try {
      const data = await getList({ ...fields });
      if (data.code === 0) {
        setLogDictData(formatDict(dictData, 'business_type'));
        return { data: data.data.list, total: data.data.total };
      }
      message.error('请求失败，请重试');
    } catch (error) {
      message.error('请求失败，请重试');
      return false;
    }
  };

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
      dataIndex: 'createTime',
      render: (_, record, index) => {
        return <span key={index}>{index + 1}</span>;
      },
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '日志ID',
      dataIndex: 'id',
    },
    {
      title: '相应时间（毫秒）',
      dataIndex: 'responseTime',
    },
    {
      title: '操作类型',
      valueType: 'option',
      dataIndex: 'businessType',
      render: (_, record) => {
        return (
          <>
            {logDictData.map(item => {
              if (item.dictValue * 1 === record.businessType) {
                return <span>{item.dictLabel}</span>;
              }
              return '';
            })}
          </>
        );
      },
    },
    {
      title: '创建时间',
      valueType: 'option',
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
              详情
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
        actionRef={actionRef}
        rowKey={record => record.id}
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
