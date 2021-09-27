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
  DatePicker,
} from 'antd';
import BraftEditor from 'braft-editor';
import moment from 'moment';
import 'braft-editor/dist/index.css';
import local from '@/utils/local';

import { addField, upadataField, getDetail, columnTree } from '../api';
import { cmsCategoryTree } from '../../category/api';
import { cmsSiteTree } from '../../site/api';

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
 * @zh-CN 站点树结构
 *
 * @param datas
 */
const setSiteTreeFormat = datas => {
  const newData = [];
  datas.map(item => {
    const obj = {
      id: item.siteId,
      value: item.siteId,
      pId: item.parentId,
      title: item.siteName,
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

const setColumnTreeFormat = arr => {
  if (!arr || (arr && arr.length === 0)) return [];
  const newTreeData = [];
  arr.map(res => {
    const obj = {
      title: res.columnName,
      value: res.columnId,
      key: res.columnId,
    };

    if (res.children && res.children.length) {
      obj.children = setColumnTreeFormat(res.children);
    }
    newTreeData.push(obj);
    return '';
  });
  return newTreeData;
};

const UpdateForm = props => {
  // 结构化数据
  const { visible, onCancel, onSuccess, data, type, indexTreeData, tagList, siteTreeData } = props;

  // 初始化 form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState([]); // 文章类型
  const [treeValue, setTreeValue] = useState(); // 文章类型值

  const [slider, setSlider] = useState(1); // 轮播地址
  const [sliderImg, setSliderImg] = useState(); // 轮播地址
  const [BraftEditorValue, setBraftEditorValue] = useState(); // 编辑器

  const [siteTreeDatas, setSiteTreeDatas] = useState([]); //  站点树处理
  const [site, setSite] = useState({ siteId: '', label: '', columnId: [] }); //  站点树处理

  const [columnTreeDatas, setColumnTreeDatas] = useState([]); //  栏目树处理
  const [columnId, setColumnId] = useState([]); //  栏目树处理

  const [hasSite, setHasSite] = useState([]);

  // const [site, setSite] = useState([
  //   {
  //     siteId: 0,
  //     columnId: [{ id: 0, label: '体育' }],
  //   },
  // ]);

  /**
   * @zh-CN 编辑器事件
   *
   * @param fields
   */
  const handleChange = value => {
    setBraftEditorValue(value.toHTML());
  };

  const setTag = tags => {
    const newTags = [];
    tags.map(item => {
      newTags.push(item.tagId);
      return '';
    });
    return newTags;
  };
  // 详情
  const getDetailData = () => {
    setLoading(true);
    getDetail(data.articleId).then(res => {
      setLoading(false);
      if (res.code === 0) {
        form.setFieldsValue({
          ...data,
          ...res.data,
          publishTime: moment(data.publishTime),
          tagIds: setTag(res.data.tags),
          content: BraftEditor.createEditorState(res.data.content),
        });
        setSlider(data.slider);
        setSiteTreeDatas(setSiteTreeFormat(siteTreeData));
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

  const setListData = () => {
    const newList = [];
    site.map(item => {
      const obj = {
        columnId: item.columnId,
        siteId: item.siteId,
      };
      newList.push(obj);
      return '';
    });
    return newList;
  };
  /**

   * @zh-CN 更新文章
   *
   * @param fields
   */
  const updataData = values => {
    const hide = message.loading('正在添加');
    setLoading(true);
    const payload = {
      categoryId: treeValue,
      content: BraftEditorValue,
      sliderImg,
      // list: setListData(),
    };
    upadataField({
      ...values,
      ...payload,
      articleId: data.articleId,
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
    const payload = {
      categoryId: treeValue,
      content: BraftEditorValue,
      sliderImg,
      list: setListData(),
    };
    addField({ ...values, ...payload }).then(res => {
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
  // ----------------------------------------------------------------- end ------ site start -----------------

  const siteOnChange = (value, label) => {
    setLoading(true);
    setSite({ siteId: value, label: label[0], columnId: [] });
    setColumnTreeDatas([]);
    setColumnId([]);
    columnTree(value).then(res => {
      setLoading(false);
      if (res.code === 0) {
        const newArr = (res.data && [res.data]) || [];
        setColumnTreeDatas(setColumnTreeFormat(newArr));
      } else {
        message.error(res.msg || '栏目请求失败，请重试');
      }
    });
  };

  const siteOnLoadData = ({ id }) => {
    return cmsSiteTree({ siteId: id }).then(res => {
      if (res.code === 0 && res.data && res.data.length) {
        const newSite = siteTreeDatas.concat(setSiteTreeFormat(res.data));
        setSiteTreeDatas(newSite);
      }
    });
  };

  const columnOnChange = (value, label) => {
    setColumnId(value);

    const columnIds = [];
    value.map((item, index) => {
      const obj = {};
      obj.columnId = item;
      obj.label = label[index];
      columnIds.push(obj);
      return '';
    });
    setSite({ ...site, columnId: columnIds });
  };

  /**
   * @zh-CN 添加栏目
   *
   * @param values
   */
  const addSite = () => {
    if (!site.siteId || site.columnId.length === 0) {
      message.error('请选择栏目后，添加');
      return;
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < hasSite.length; i++) {
      if (hasSite[i].siteId === site.siteId) {
        message.error('该站点已存在，请编辑或删除后操作');
        return;
      }
    }
    setHasSite(hasSite.concat([site]));
  };

  //------------------------------------------------------------------------------------------------------------------

  const accessToken = local.get('token');
  // 轮播图
  const sliderImgProps = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    showUploadList: false,
    data: { businessType: 'cms', fileName: 'fileName' },
    // eslint-disable-next-line no-undef
    action: `${API_PREFIX}/upload`,
    onChange: info => {
      setLoading(true);
      if (info.file && info.file.response && info.file.response.code === 0) {
        setLoading(false);
        setSliderImg(info.file.response.data.fileUrl);
      }
    },
    multiple: true,
  };
  // eslint-disable-next-line no-undef
  const sliderImgBg = `${baseUrl}${sliderImg}`;

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
            <Form.Item name="tagIds" label="选择标签" rules={[{ required: true }]}>
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
                      <div>
                        <TreeSelect
                          treeData={siteTreeDatas}
                          onChange={(value, label, extra) => {
                            siteOnChange(value, label, extra);
                          }}
                          value={site.siteId}
                          treeDataSimpleMode
                          placeholder="选择站点"
                          loadData={obj => siteOnLoadData(obj)}
                          style={{ width: 200 }}
                          allowClear
                        />
                        <TreeSelect
                          treeData={columnTreeDatas}
                          value={columnId}
                          onChange={(value, label, extra) => columnOnChange(value, label, extra)}
                          multiple
                          treeDefaultExpandAll
                          placeholder="选择栏目"
                          style={{ width: 300 }}
                          allowClear
                        />
                        <Button type="primary" style={{ marginLeft: 10 }} onClick={addSite}>
                          添加
                        </Button>
                        <div className={styles.siteBox}>
                          <p>已选栏目：</p>
                          {hasSite.length > 0 &&
                            hasSite.map(item => {
                              return (
                                <div key={item.siteId}>
                                  <h3>{item.label}</h3>
                                  {item.columnId.map(items => {
                                    return <span key={items.columnId}>{items.label}</span>;
                                  })}
                                </div>
                              );
                            })}
                        </div>
                      </div>
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
                      <Button loading={loading} style={{ backgroundImage: `url(${sliderImgBg})` }}>
                        上传
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </div>
            )}
            <Form.Item width="xs" name="orderNum" label="显示顺序">
              <InputNumber min={0} max={1000} />
            </Form.Item>
            <Form.Item width="xs" name="publishTime" label="发布时间">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default UpdateForm;
