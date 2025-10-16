"use client";

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X,
  Download,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-12 w-12 text-orange-500" />;
      case 'info':
        return <Info className="h-12 w-12 text-blue-500" />;
      default:
        return <Info className="h-12 w-12 text-blue-500" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white dark:bg-gray-900">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          <div className="flex flex-col items-center text-center space-y-3">
            {getIcon()}
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <CardDescription className="text-base leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">
            {message}
          </CardDescription>
          
          <div className="flex space-x-3 justify-center">
            {showCancel && (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-6"
              >
                {cancelText}
              </Button>
            )}
            <Button 
              variant={getVariant() as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning" | "info" | "premium"}
              onClick={handleConfirm}
              className="px-6"
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Context for managing alert dialogs
interface AlertContextType {
  showAlert: (options: Omit<AlertDialogProps, 'isOpen' | 'onClose'>) => void;
  showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
  showError: (title: string, message: string, onConfirm?: () => void) => void;
  showWarning: (title: string, message: string, onConfirm?: () => void) => void;
  showInfo: (title: string, message: string, onConfirm?: () => void) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertProps, setAlertProps] = useState<AlertDialogProps | null>(null);

  const showAlert = (options: Omit<AlertDialogProps, 'isOpen' | 'onClose'>) => {
    setAlertProps({
      ...options,
      isOpen: true,
      onClose: () => setAlertProps(null)
    });
  };

  const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'success', onConfirm });
  };

  const showError = (title: string, message: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'error', onConfirm });
  };

  const showWarning = (title: string, message: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'warning', onConfirm });
  };

  const showInfo = (title: string, message: string, onConfirm?: () => void) => {
    showAlert({ title, message, type: 'info', onConfirm });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    showAlert({ 
      title, 
      message, 
      type: 'warning', 
      onConfirm, 
      showCancel: true,
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    });
  };

  return (
    <AlertContext.Provider value={{ 
      showAlert, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo, 
      showConfirm 
    }}>
      {children}
      {alertProps && <AlertDialog {...alertProps} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    // In development, log the error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('useAlert must be used within an AlertProvider. Component stack:', new Error().stack);
    }
    // Return a fallback implementation that uses browser alerts
    return {
      showAlert: (options: Omit<AlertDialogProps, 'isOpen' | 'onClose'>) => alert(options.message || options.title),
      showSuccess: (title: string, message: string) => alert(`${title}: ${message}`),
      showError: (title: string, message: string) => alert(`Error - ${title}: ${message}`),
      showWarning: (title: string, message: string) => alert(`Warning - ${title}: ${message}`),
      showInfo: (title: string, message: string) => alert(`Info - ${title}: ${message}`)
    };
  }
  return context;
};

export { AlertDialog };