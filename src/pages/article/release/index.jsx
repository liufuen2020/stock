import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './index.less';

const ArticleRelease = () => {
  const [BraftEditorValue, setBraftEditorValue] = useState();

  const handleChange = value => {
    setBraftEditorValue(value.toHTML());
  };

  console.log(BraftEditorValue);

  useEffect(() => {
    const fun = () => {
      return [1, 2];
    };
    const [a, b] = fun();
    console.log(a, b);
  }, []);

  return (
    <PageContainer>
      <div className="gwrap">
        <BraftEditor
          className={styles.myEditor}
          value={BraftEditorValue}
          // controls={controls}
          placeholder="请输入正文内容"
          onChange={handleChange}
          // media={{ uploadFn: myUploadFn }}
        />
      </div>
    </PageContainer>
  );
};

export default ArticleRelease;
