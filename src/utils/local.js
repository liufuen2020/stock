const local = {
  get: key => {
    return JSON.parse(localStorage.getItem(key));
  },
  set: (key, data) => {
    return localStorage.setItem(key, JSON.stringify(data));
  },
  remove: key => {
    return localStorage.removeItem(key);
  },
  clear: () => {
    return localStorage.clear();
  },
};
export default local;
