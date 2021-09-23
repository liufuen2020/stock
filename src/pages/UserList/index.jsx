import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { sysUserList, getRule, removeRule, getSysPost, getSysDeptTreelist } from './api';
import UpdateForm from './components/UpdateForm';

/**
 * @zh-CN 获取列表
 * @param fields
 */

const getSysUserList = async fields => {
  try {
    const data = await sysUserList({ ...fields });
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
  const [type, setType] = useState();

  const [roleList, setRoleList] = useState();
  const [sysPostList, setSysPostList] = useState();
  const [sysDeptData, setSysDeptData] = useState();
  /**
   * @zh-CN 获取角色
   *
   * @param
   */
  const getRoleList = () => {
    getRule().then(res => {
      if (res.code === 0) {
        setRoleList(res.data || []);
      }
    });
  };

  /**
   * @zh-CN 获取岗位
   *
   * @param
   */
  const getSysPostData = () => {
    getSysPost().then(res => {
      if (res.code === 0) {
        setSysPostList(res.data || []);
      }
    });
  };

  const setTreeFormat = data => {
    const newData = [];
    data.map(item => {
      const obj = {
        id: item.deptId,
        value: item.deptId,
        title: item.deptName,
        pId: item.parentId,
        isLeaf: false,
      };
      newData.push(obj);
      return '';
    });
    return newData;
  };

  /**
   * @zh-CN 获取部门树
   *
   * @param
   */
  const getSysDeptTreelistData = () => {
    getSysDeptTreelist().then(res => {
      if (res.code === 0) {
        setSysDeptData(setTreeFormat(res.data || []));
      }
    });
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

  useEffect(() => {
    getRoleList();
    getSysPostData();
    getSysDeptTreelistData();
  }, []); // 更新数据 组件 ------------------------------------------------------------------

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
            <Button type="link" onClick={() => handleRemove(record.userId)}>
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
        actionRef={actionRef}
        rowKey={record => record.userId}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={addUser}>
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
        sysDeptData={sysDeptData}
        roleList={roleList}
        sysPostList={sysPostList}
      />
    </PageContainer>
  );
};

export default TableList;
