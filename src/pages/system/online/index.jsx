import { Button, message } from 'antd';
import React, { useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { getList, forceLogout } from './api';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const getListData = async fields => {
  try {
    const data = await getList({ ...fields });
    return { data: data.data.list };
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
  const setForceLogout = async id => {
    const hide = message.loading('正在下线');

    try {
      const msg = await forceLogout(id);
      hide();
      if (msg.code === 0) {
        message.success('下线成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('操作失败，请重试');
      }

      return true;
    } catch (error) {
      hide();
      message.error('操作失败，请重试');
      return false;
    }
  };

  useEffect(() => {}, []);

  // ----------------------------------------------结束------------------------------------------------------

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
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
            <Button type="link" onClick={() => setForceLogout(record.tokenId)}>
              强制下线
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
        rowKey={record => record.tokenId}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => []}
        request={getListData}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
