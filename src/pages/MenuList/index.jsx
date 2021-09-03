import { Button, message, Table, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { removeMenu, getMenu } from './api';
import UpdateForm from './components/UpdateForm';
import styles from './index.less';

const setList = arr => {
  const newTreeData = [];
  arr.map(item => {
    const obj = { ...item };

    if (item.children && item.children.length) {
      obj.children = setList(item.children);
    } else {
      obj.children = null;
    }
    newTreeData.push(obj);
    return '';
  });
  return newTreeData;
};

const TableList = () => {
  const [menuData, setMenuData] = useState();

  //  加载主数据
  const getData = () => {
    const hide = message.loading('正在加载数据');
    getMenu().then(res => {
      hide();
      if (res.code === 0) {
        const newData = setList(res.data || []);
        setMenuData(newData);
      }
    });
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
    getData();
  };

  // 添加角色
  const addData = () => {
    setType('add');
    setUpdataData({});
    handleUpdateModalVisible(true);
  };

  // ----------------------------------------------结束------------------------------------------------------

  const handleRemove = id => {
    removeMenu(id).then(res => {
      if (res.code === 0) {
        message.success('删除成功！');
        getData();
      } else {
        message.error(res.msg || '删除失败，请重试');
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

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
      title: '菜单名称',
      dataIndex: 'menuName',
    },
    {
      title: '路径',
      dataIndex: 'path',
    },
    {
      title: '菜单ID',
      dataIndex: 'menuId',
    },
    {
      title: '父级ID',
      dataIndex: 'parentId',
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
            <Button type="link" onClick={() => handleRemove(record.menuId)}>
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
      <div className={styles.btnBox}>
        <Button type="primary" onClick={addData}>
          添加菜单
        </Button>
      </div>
      <Table columns={columns} dataSource={menuData} rowKey={record => record.menuId} />

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
