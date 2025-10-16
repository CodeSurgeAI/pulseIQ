"use client";

import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  title, 
  message, 
  type, 
  duration = 4000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackground = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`
      ${getBackground()} 
      border-l-4 rounded-r-lg shadow-lg p-4 mb-3 
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
    `}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = (toastData: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastProps = {
      ...toastData,
      id,
      onClose: removeToast
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'success', duration });
  };

  const showError = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'error', duration });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'warning', duration });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'info', duration });
  };

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo 
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // In development, log the error for debugging  
    if (process.env.NODE_ENV === 'development') {
      console.error('useToast must be used within a ToastProvider. Component stack:', new Error().stack);
    }
    // Return a fallback implementation that uses browser alerts
    return {
      showToast: (options: Omit<ToastProps, 'id' | 'onClose'>) => alert(options.title || options.message),
      showSuccess: (title: string, message: string) => alert(`✅ ${title}: ${message}`),
      showError: (title: string, message: string) => alert(`❌ Error - ${title}: ${message}`),
      showWarning: (title: string, message: string) => alert(`⚠️ Warning - ${title}: ${message}`),
      showInfo: (title: string, message: string) => alert(`ℹ️ Info - ${title}: ${message}`)
    };
  }
  return context;
};