import React, { useState, useEffect } from 'react';
import {
  message,
  Drawer,
  Form,
  Input,
  Button,
  Radio,
  Select,
  InputNumber,
  Row,
  Col,
  TreeSelect,
  Upload,
  Spin,
} from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import local from '@/utils/local';

import { addField, upadataField, getDetail } from '../api';
import { cmsCategoryTree } from '../../category/api';
// import { cmsColumnTree } from '../../column/api';

import styles from '../index.less';

const { Option } = Select;

/**
 * @zh-CN 文章类型
 *
 * @param datas
 */
const setAreaTreeFormat = datas => {
  const newData = [];
  datas.map(item => {
    const obj = {
      id: item.categoryId,
      value: item.categoryId,
      pId: item.parentId,
      title: item.categoryName,
      isLeaf: !item.parentNode,
    };
    newData.push(obj);
    return '';
  });
  return newData;
};

/**
 * @zh-CN 栏目
 *
 * @param datas
 */
// const setColumnTreeFormat = datas => {
//   const newData = [];
//   datas.map(item => {
//     const obj = {
//       id: item.columnId,
//       value: item.columnId,
//       pId: item.parentId,
//       title: item.columnName,
//       isLeaf: item.parentNode,
//     };
//     newData.push(obj);
//     return '';
//   });
//   return newData;
// };

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, type, indexTreeData, tagList } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState([]); // 文章类型
  const [treeValue, setTreeValue] = useState(); // 文章类型值

  const [slider, setSlider] = useState(1); // 轮播地址
  const [sliderImg, setSliderImg] = useState(); // 轮播地址
  const [BraftEditorValue, setBraftEditorValue] = useState(); // 编辑器

  const [site, setSite] = useState([
    {
      columnId: 0,
      siteId: 0,
      treeData: [],
    },
    {
      columnId: 1,
      siteId: 1,
      treeData: [],
    },
  ]);

  // const [columnTreeData, setColumnTreeData] = useState(); // 栏目
  // const [columnTreeValue, setColumnTreeValue] = useState();

  /**

   * @zh-CN 编辑器事件
   *
   * @param fields
   */
  const handleChange = value => {
    setBraftEditorValue(value.toHTML());
  };

  // const getColumnTreeData = id => {
  //   cmsColumnTree({ columnId: id }).then(res => {
  //     if (res.code === 0) {
  //       setColumnTreeData(setColumnTreeFormat(res.data));
  //     }
  //   });
  // };

  // 详情
  const getDetailData = () => {
    setLoading(true);
    getDetail(data.articleId).then(res => {
      setLoading(false);
      if (res.code === 0) {
        form.setFieldsValue({
          ...data,
          ...res.data,
          content: BraftEditor.createEditorState(res.data.content),
        });
        setSlider(data.slider);

        setBraftEditorValue(data.content);
      } else {
        message.error(res.msg || '详情请求失败，请重试');
      }
    });
  };
  useEffect(() => {
    setTreeData(setAreaTreeFormat(indexTreeData));
    form.setFieldsValue({ slider: 1 });
    if (type === 'updata' && visible === true) {
      getDetailData();
    } else {
      form.resetFields();
      form.setFieldsValue({ slider: 1 });
    }
  }, [visible]);

  // 栅格化
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };

  /**

   * @zh-CN 更新文章
   *
   * @param fields
   */
  const updataData = values => {
    const hide = message.loading('正在添加');
    setLoading(true);
    upadataField({
      ...values,
      list: [
        {
          columnId: 0,
          siteId: 0,
        },
      ],
      articleId: data.articleId,
      categoryId: treeValue,
      content: BraftEditorValue,
    }).then(res => {
      hide();
      setLoading(false);
      if (res.code === 0) {
        onCancel(false);
        onSuccess();
      } else {
        message.error(res.msg || '修改失败，请重试');
      }
    });
  };
  /**
   * @en-US Update node
   * @zh-CN 添加文章
   *
   * @param values
   */
  const addData = values => {
    const hide = message.loading('正在添加');
    setLoading(true);

    addField({ ...values, categoryId: treeValue, content: BraftEditorValue }).then(res => {
      hide();
      setLoading(false);
      if (res.code === 0) {
        onCancel(false);
        onSuccess();
      } else {
        message.error(res.msg || '添加失败，请重试');
      }
    });
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param values
   */
  const sendData = () => {
    form.validateFields().then(values => {
      if (type === 'updata') updataData(values);
      if (type === 'add') addData(values);
    });
  };

  const modelClose = () => {
    onCancel(false);
  };

  // ------------------------------tree -----------------------

  const areaOnLoadData = ({ id }) =>
    cmsCategoryTree({ categoryId: id }).then(res => {
      if (res.code === 0) {
        setTreeData(treeData.concat(setAreaTreeFormat(res.data)));
      }
    });

  const areaTreeDataChange = value => {
    setTreeValue(value);
  };
  const areaTProps = {
    treeData: treeData && treeData.length ? treeData : setAreaTreeFormat(indexTreeData),
    value: treeValue,
    onChange: value => {
      areaTreeDataChange(value);
    },
  };
  // ----------------------------------------------------------------- end -----------------------

  const siteOnChange = (value, index) => {
    const newSite = JSON.parse(JSON.stringify(site));
    newSite[index].siteId = value;
    setSite(newSite);
  };

  //---------------------

  const accessToken = local.get('token');
  // 轮播图
  const sliderImgProps = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    showUploadList: false,
    // eslint-disable-next-line no-undef
    action: `${API_PREFIX}/sysPerson/avatar`,
    onChange: info => {
      setLoading(true);
      if (info.file && info.file.response && info.file.response.code === 0) {
        setLoading(false);
        setSliderImg(info.file.response.data);
      }
    },
    multiple: true,
  };

  // 监听字段变化
  const formChange = value => {
    if (value.slider || value.slider === 0) {
      setSlider(value.slider);
    }
  };

  return (
    <>
      <Drawer
        getContainer={false}
        width={1140}
        title={type === 'updata' ? '修改' : '添加'}
        visible={visible}
        onClose={modelClose}
        maskClosable={false}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={modelClose} style={{ marginRight: 10 }}>
              取消
            </Button>
            <Button onClick={sendData} type="primary" loading={loading} disabled={loading}>
              保存
            </Button>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form {...formItemLayout} name="control-ref" form={form} onValuesChange={formChange}>
            <Form.Item label="文章标题" name="articleTitle" rules={[{ required: true }]}>
              <Input maxLength={120} allowClear style={{ width: 500 }} />
            </Form.Item>
            <Form.Item label="文章关键词" name="keywords" rules={[{ required: true }]}>
              <Input maxLength={120} allowClear style={{ width: 500 }} />
            </Form.Item>
            <Form.Item name="tagIds" label="选择标签">
              <Select mode="multiple" placeholder="选择标签" style={{ width: 500 }}>
                {tagList &&
                  tagList.map(item => {
                    return (
                      <Option value={item.tagId} key={item.tagId}>
                        {item.tagName}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item label="文章简介" name="description">
              <Input.TextArea maxLength={200} allowClear style={{ width: 500 }} />
            </Form.Item>
            {visible && (
              <>
                <div className={styles.treeBox}>
                  <Row>
                    <Col span={14} push={4}>
                      {site.map((item, index) => {
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={index}>
                            <TreeSelect
                              treeData={
                                treeData && treeData.length
                                  ? treeData
                                  : setAreaTreeFormat(indexTreeData)
                              }
                              onChange={value => siteOnChange(value, index)}
                              value={item.siteId}
                              treeDataSimpleMode
                              placeholder="选择站点"
                              loadData={obj => areaOnLoadData(obj)}
                              style={{ width: 200 }}
                              allowClear
                            />
                            <TreeSelect
                              value={item.columnId}
                              treeDataSimpleMode
                              placeholder="选择栏目"
                              loadData={obj => areaOnLoadData(obj)}
                              style={{ width: 300 }}
                              allowClear
                            />
                          </div>
                        );
                      })}
                    </Col>
                    <Col span={4} pull={14}>
                      <div className={styles.treeName}>选择栏目：</div>
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {visible && (
              <div className={styles.treeBox}>
                <Row>
                  <Col span={14} push={4}>
                    <TreeSelect
                      {...areaTProps}
                      treeDataSimpleMode
                      loadData={obj => areaOnLoadData(obj)}
                      style={{ width: 500 }}
                      allowClear
                    />
                  </Col>
                  <Col span={4} pull={14}>
                    <div className={styles.treeName}>文章类型：</div>
                  </Col>
                </Row>
              </div>
            )}
            <Form.Item name="top" label="是否置顶">
              <Radio.Group>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="original" label="是否原创">
              <Radio.Group>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="slider" label="是否轮播">
              <Radio.Group>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </Radio.Group>
            </Form.Item>
            {slider === 0 && (
              <div className={styles.sliderImgBox}>
                <Row>
                  <Col span={19} push={4}>
                    <Upload {...sliderImgProps}>
                      <Button loading={loading} style={{ backgroundImage: `url(${sliderImg})` }}>
                        上传
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </div>
            )}
            <Form.Item width="xs" name="orderNum" label="显示顺序" rules={[{ required: true }]}>
              <InputNumber min={0} max={1000} />
            </Form.Item>
            <Form.Item
              width="xs"
              name="content"
              label="文章"
              rules={[
                {
                  required: true,
                  validator: (_, value, callback) => {
                    if (value.isEmpty()) {
                      callback('请输入正文内容');
                    } else {
                      callback();
                    }
                  },
                },
              ]}
            >
              <BraftEditor
                className={styles.myEditor}
                // value={BraftEditorValue}
                // controls={controls}
                placeholder="请输入正文内容"
                onChange={handleChange}
                // media={{ uploadFn: myUploadFn }}
              />
            </Form.Item>
            {/* <div className={styles.treeBox}>
              <Row>
                <Col span={19} push={4}></Col>
                <Col span={4} pull={19}>
                  <div className={styles.treeName}>文章：</div>
                </Col>
              </Row>
            </div> */}
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default UpdateForm;
