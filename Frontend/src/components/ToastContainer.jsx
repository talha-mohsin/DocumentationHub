import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

let triggerToast;

export const showToast = (type, message) => {
  if (triggerToast) triggerToast({ type, message });
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    triggerToast = (data) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...data, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    return () => {
      triggerToast = null;
    };
  }, []);

  const config = {
    success: { icon: <CheckCircle size={20} />, style: "bg-green-500/10 text-green-500 border-green-500" },
    error: { icon: <XCircle size={20} />, style: "bg-red-500/10 text-red-500 border-red-500" },
    info: { icon: <Info size={20} />, style: "bg-blue-500/10 text-blue-500 border-blue-500" },
  };

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-3">
  {toasts.map((toast) => (
    <div
      key={toast.id}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-xl backdrop-blur-md ${config[toast.type]?.style} animate-slide-in`}
    >
      {config[toast.type]?.icon}
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        className="ml-2 opacity-70 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  ))}
</div>
  );
};