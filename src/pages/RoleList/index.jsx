import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';

import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { removeRule, getRule, meunTree } from '@/services/ant-design-pro/api';
import UpdateForm from './components/UpdateForm';

/**
 * @zh-CN 添加节点
 * @param fields
 */

const getSysUserList = async fields => {
  try {
    const data = await getRule({ ...fields });

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
  const [treeData, setTreeData] = useState(false);

  const [type, setType] = useState();

  /**
   * @zh-CN 加载菜单
   *  */

  const setList = arr => {
    const newTreeData = [];
    arr.map(res => {
      const obj = {
        title: res.menuName,
        value: res.menuId,
        key: res.menuId,
      };

      if (res.children && res.children.length) {
        obj.children = setList(res.children);
      }
      newTreeData.push(obj);
      return '';
    });
    return newTreeData;
  };

  const getMenuList = () => {
    meunTree().then(res => {
      if (res.code === 0 && res.data && res.data.length) {
        setTreeData(setList(res.data));
      } else {
        message.error(res.msg || '菜单加载失败');
      }
    });
  };

  useEffect(() => {
    getMenuList();
  }, []);

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
  //  更新数据 结束------------------------------------------------------------------

  // 添加角色
  const addRole = () => {
    setType('add');
    setUpdataData({});
    handleUpdateModalVisible(true);
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */

  const handleRemove = async id => {
    const hide = message.loading('正在删除');

    try {
      await removeRule(id);
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
        return <span key={index}>{index + 1}</span>;
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: 'roleKey',
      dataIndex: 'roleKey',
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
              onConfirm={() => handleRemove(record.roleId)}
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
        rowKey={record => record.roleId}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={addRole}>
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
        menuData={treeData}
        type={type}
      />
    </PageContainer>
  );
};

export default TableList;
