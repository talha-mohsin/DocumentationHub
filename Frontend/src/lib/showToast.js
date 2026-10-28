let listeners = [];

export const showToast = (type, message) => {
  listeners.forEach((cb) => cb({ type, message }));
};

export const subscribeToast = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};