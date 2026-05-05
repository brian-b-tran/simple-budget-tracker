type Listener = () => void;

let listeners: Listener[] = [];

const authEvents = {
  on: (listener: Listener) => {
    listeners.push(listener);
    // return a cleanup function to unsubscribe
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  emit: () => {
    listeners.forEach((l) => l());
  },
};

export default authEvents;
