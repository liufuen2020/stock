import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Popconfirm, Modal, Spin, Checkbox } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { getList, tagList, audit, getDetail } from './api';
import { cmsCategoryTree } from '../category/api';
import { cmsSiteTree } from '../site/api';
import UpdateForm from './components/UpdateForm';
import styles from './index.less';

/**
 * @zh-CN 反处理 栏目数据
 *
 * @param columnData
 */
const setColumnDataTwo = columnData => {
  const a = {};
  const b = {};
  const c = {};
  columnData.forEach(item => {
    const id = item.siteId;
    a[id] = id;
    b[id] = b[id] || [];
    c[id] = item.siteName;
    b[id].push({ columnId: item.columnId, label: item.columnName });
  });

  const f = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const x in a) {
    f.push({
      siteId: a[x],
      label: c[x],
      columnId: b[a[x]],
    });
  }

  return f;
};
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

  const [currentId, setCurrentId] = useState();
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false); // 审核模块
  const [delVisible, setDelVisible] = useState(false); // 删除模块

  const [delList, setDelList] = useState([]);

  const isCmsAdmin =
    initialState.currentUser && initialState.currentUser.roles
      ? // eslint-disable-next-line no-undef
        initialState.currentUser.roles.includes(CMS_ADMIN)
      : false;

  /**
   * @zh-CN 状态提交
   *
   * @param selectedRows
   */
  const handleSend = async (id, value, msg) => {
    const hide = message.loading('正在提交');

    const ids = [];
    ids[0] = id;
    try {
      const res = await audit({ state: value, articleIds: ids });
      hide();
      if (res.code === 0) {
        message.success(msg);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        setVisible(false);
        return true;
      }
      message.success(res.msg || '提交失败');

      return false;
    } catch (error) {
      hide();
      message.error('提交失败，请重试');
      return false;
    }
  };

  /**
   * @zh-CN 状态审核
   * @param state
   */
  const opt = (state, id) => {
    setCurrentId(id);
    if (state === 3) {
      return (
        <Popconfirm
          placement="topRight"
          title="确实要取消发布吗？"
          onConfirm={() => handleSend(id, 4, '取消发布成功')}
          okText="确定"
          cancelText="取消"
        >
          <Divider type="vertical" />
          <Button type="link">取消发布</Button>
        </Popconfirm>
      );
    }
    if (state === 1) {
      return (
        <>
          <Divider type="vertical" />
          <Button type="link" onClick={() => setVisible(true)}>
            审核
          </Button>
        </>
      );
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

  // 获取 站点树结构
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
   * @zh-CN 删除模块
   * */

  const del = id => {
    setLoading(true);
    setDelList([]);
    getDetail(id).then(res => {
      setLoading(false);

      if (res.code === 0 && res.data) {
        setDelVisible(true);
        const siteColumns = setColumnDataTwo(res.data.siteColumns) || [];
        setDelList(siteColumns);
      } else {
        message.error(res.msg || '详情请求失败，请重试');
      }
    });
    setDelVisible(true);
  };

  const onCheckColumnId = (e, i, j) => {
    const newList = JSON.parse(JSON.stringify(delList));
    newList[i].columnId[j].checked = e.target.checked;
    setDelList(newList);
  };

  const onCheckAllChange = e => {
    const newList = JSON.parse(JSON.stringify(delList));
    newList.map(item => {
      item.columnId.map(items => {
        items.checked = e.target.checked;
        return '';
      });
      return '';
    });
    setDelList(newList);
  };

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
          text: '审核通过',
          status: 'Success',
        },
        4: {
          text: '已取消发布',
          status: 'Default',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'opt',
      valueType: 'option',
      render: (_, record) => {
        const text = (
          <div className={styles.optBox}>
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
            {record.state === 4 && (
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
                详情
              </Button>
            )}
            {record.state === 3 && (
              <Button type="link" onClick={() => setUpdateForm(record)}>
                详情
              </Button>
            )}

            {opt(record.state, record.articleId)}
            <Divider type="vertical" />
            <Button type="link" onClick={() => del(record.articleId)}>
              删除
            </Button>
          </div>
        );
        return <>{text}</>;
      },
    },
  ];
  return (
    <PageContainer>
      <Spin spinning={loading}>
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
        <Modal
          visible={visible}
          title="审核"
          onCancel={() => setVisible(false)}
          footer={[
            <Button key="back" onClick={() => setVisible(false)}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              danger
              loading={loading}
              onClick={() => handleSend(currentId, 2, '审核不通过')}
            >
              不通过
            </Button>,
            <Button
              loading={loading}
              type="primary"
              onClick={() => handleSend(currentId, 3, '审核已通过')}
            >
              通过
            </Button>,
          ]}
        >
          <p>确定要审核通过吗？</p>
        </Modal>

        <Modal
          visible={delVisible}
          title="删除"
          onCancel={() => setDelVisible(false)}
          okText="删除"
        >
          <Checkbox onChange={onCheckAllChange}>全部</Checkbox>
          {delList.map((item, index) => {
            return (
              <div key={item.siteId} className={styles.delSiteIdBox}>
                <h3>{item.label}</h3>

                {item.columnId.map((items, indexs) => {
                  return (
                    <Checkbox
                      checked={items.checked}
                      key={items.columnId}
                      value={items.columnId}
                      onChange={e => onCheckColumnId(e, index, indexs)}
                    >
                      {items.label}
                    </Checkbox>
                  );
                })}
              </div>
            );
          })}
        </Modal>
      </Spin>
    </PageContainer>
  );
};

export default TableList;
