import { Button, message, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { removeMenu, getMenu } from './api';

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
          <Button type="link" onClick={() => handleRemove(record.menuId)}>
            删除
          </Button>
        );
        return <>{text}</>;
      },
    },
  ];
  return (
    <PageContainer>
      <Table columns={columns} dataSource={menuData} rowKey={record => record.menuId} />
    </PageContainer>
  );
};

export default TableList;
