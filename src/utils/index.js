export const formatDict = (data, dictType) => {
  let arr = [];
  data.map(item => {
    if (item.dictType === dictType) {
      arr = item.list || [];
    }
    return '';
  });
  return arr;
};

export const format = () => {};
