import { Button, message, Table, Divider, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { meunTree } from '@/services/ant-design-pro/api';
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

const setListMenu = arr => {
  const newTreeData = [];
  arr.map(res => {
    const obj = {
      title: res.menuName,
      value: res.menuId,
      key: res.menuId,
    };

    if (res.children && res.children.length) {
      obj.children = setListMenu(res.children);
    }
    newTreeData.push(obj);
    return '';
  });
  return newTreeData;
};
const TableList = () => {
  const [menuData, setMenuData] = useState();
  const [treeData, setTreeData] = useState([]);

  // console.log(123, treeData);

  const getMenuList = () => {
    meunTree().then(res => {
      if (res.code === 0 && res.data && res.data.length) {
        setTreeData(setListMenu(res.data));
      } else {
        message.error(res.msg || '菜单加载失败');
      }
    });
  };

  //  加载主数据
  const getData = () => {
    const hide = message.loading('正在加载数据');
    getMenu().then(res => {
      hide();
      if (res.code === 0) {
        const newData = setList(res.data || []);
        setMenuData(newData);
        getMenuList();
      }
    });
  };

  // useEffect(() => {
  //   getMenuList();
  // }, []);

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
      title: '类型',
      dataIndex: 'menuType',
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
            <Popconfirm
              placement="topRight"
              title="确实要删除此条信息吗？"
              onConfirm={() => handleRemove(record.menuId)}
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
        menuData={treeData}
        onSuccess={updataSuccess}
        type={type}
      />
    </PageContainer>
  );
};

export default TableList;
