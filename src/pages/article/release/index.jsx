import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { getList, removeField, tagList, audit } from './api';
import { cmsCategoryTree } from '../category/api';
import { cmsSiteTree } from '../site/api';
import UpdateForm from './components/UpdateForm';
import styles from './index.less';

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
  } catch (error) {
    message.error('请求失败，请重试');
    return false;
  }
};

const TableList = () => {
  const actionRef = useRef();

  const [treeData, setTreeData] = useState([]);
  const [tagListData, setTagListData] = useState([]);

  const [siteTreeData, setSiteTreeData] = useState([]);

  const { initialState } = useModel('@@initialState');

  const isCmsAdmin =
    initialState.currentUser && initialState.currentUser.roles
      ? // eslint-disable-next-line no-undef
        initialState.currentUser.roles.includes(CMS_ADMIN)
      : false;

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
      message.error(msg.msg || '删除失败！');
      return false;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  /**
   * @zh-CN 状态提交
   *
   * @param selectedRows
   */
  const handleSend = async (state, id) => {
    const hide = message.loading('正在提交');

    const ids = [];
    ids[0] = id;
    try {
      const msg = await audit({ state, articleIds: ids });
      hide();
      if (msg.code === 0) {
        message.success('提交成功！');
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      }

      return false;
    } catch (error) {
      hide();
      message.error('提交失败，请重试');
      return false;
    }
  };

  // 获取 类别树结构
  const getListTree = async fields => {
    try {
      const data = await cmsCategoryTree({ ...fields });
      if (data.code === 0) {
        setTreeData(data.data);
        return;
      }
    } catch (error) {
      message.error('请求文章类别失败，请重试');
      return false;
    }
  };

  // 获取 类别树结构
  const getSiteTree = async fields => {
    try {
      const data = await cmsSiteTree({ ...fields });
      if (data.code === 0) {
        setSiteTreeData(data.data);
        return;
      }
    } catch (error) {
      message.error('请求站点失败，请重试');
      return false;
    }
  };

  // 获取 tagList
  const getTagList = async fields => {
    try {
      const data = await tagList({ ...fields });
      if (data.code === 0) {
        setTagListData(data.data);
        return;
      }
    } catch (error) {
      message.error('请求标签失败，请重试');
      return false;
    }
  };

  useEffect(() => {
    getListTree();
    getTagList();
    getSiteTree();
  }, []);

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
        return <span key={index}>{index + 1}</span>;
      },
    },
    {
      title: '文章名称',
      dataIndex: 'articleTitle',
    },
    {
      title: '作者姓名',
      dataIndex: 'authorName',
    },

    {
      title: '标签',
      dataIndex: 'tags',
      render: (_, record) => {
        return record.tags.map(item => {
          return (
            <span key={item.tagId} className={styles.tag}>
              {item.tagName}
            </span>
          );
        });
      },
    },
    {
      title: '是否置顶',
      dataIndex: 'top',
      align: 'center',
      render: (_, record) => {
        return <>{record.top ? '否' : '是'}</>;
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
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        0: {
          text: '待提交',
          status: 'Processing',
        },
        1: {
          text: '提交待审核',
          status: 'Processing',
        },
        2: {
          text: '审核不通过',
          status: 'Error',
        },
        3: {
          text: '审核通过已发布',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'opt',
      valueType: 'option',
      render: (_, record) => {
        const text = (
          <>
            {record.state === 0 && (
              <Button type="link" onClick={() => setUpdateForm(record)}>
                编辑
              </Button>
            )}
            {record.state === 2 && isCmsAdmin === false && (
              <Button type="link" onClick={() => setUpdateForm(record)}>
                编辑
              </Button>
            )}
            {record.state === 2 && isCmsAdmin === true && (
              <Button type="link" onClick={() => setUpdateForm(record)}>
                详情
              </Button>
            )}
            {record.state === 1 && (
              <Button type="link" onClick={() => setUpdateForm(record)}>
                审核
              </Button>
            )}
            {record.state === 3 && (
              <Button type="link" onClick={() => setUpdateForm(record)}>
                详情
              </Button>
            )}
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
              title="确实要删除此条文章吗？"
              onConfirm={() => handleRemove(record.siteId)}
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
        rowKey={record => record.articleId}
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
        tagList={tagListData}
        siteTreeData={siteTreeData}
        indexTreeData={treeData}
      />
    </PageContainer>
  );
};

export default TableList;
