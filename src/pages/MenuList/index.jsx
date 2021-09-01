import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { addMenu, updateRule, removeRule, getMenu } from '@/services/ant-design-pro/api';
import UpdateForm from './components/UpdateForm';
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const getSysUserList = async fields => {
  try {
    const data = await getMenu({ ...fields });
    return { data: data.data };
  } catch (error) {
    message.error('请求失败，请重试');
    return false;
  }
};

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addMenu({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('Configuring');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};
/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  const formLayout = 'horizontal';
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
      render: row => {
        const text = (
          <Button type="link" onClick={() => handleRemove(row.deptId)}>
            删除
          </Button>
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
        rowKey={record => record.userName}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getSysUserList}
        columns={columns}
      />

      <ModalForm
        title=""
        width="800px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        {...formItemLayout}
        layout={formLayout}
        onFinish={async value => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入菜单名称',
            },
          ]}
          width="md"
          label="菜单"
          name="menuName"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入菜单路径',
            },
          ]}
          width="md"
          label="路径"
          name="path"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入菜单顺序',
            },
          ]}
          width="md"
          label="顺序"
          name="orderNum"
        />
        <ProFormText width="md" label="父级菜单Id" name="parentId" />
      </ModalForm>

      <UpdateForm
        onSubmit={async value => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);

          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
