export const removeToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    localStorage.removeItem("token");
  }
};
