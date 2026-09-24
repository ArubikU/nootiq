"use client";

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { createContext, ReactNode, useContext, useState } from "react";

type AlertType = "success" | "error" | "info" | "warning";

interface Alert {
  id: number;
  type: AlertType;
  message: string;
}

type AlertContextType = {
  alert: (message: string, type: AlertType) => void;
  confirm: (message: string) => Promise<boolean>;
  either: (message: string, options: string[]) => Promise<string>;
  alerts: Alert[];
  removeAlert: (id: number) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

let alertId = 0;

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-600" />,
  error: <XCircle className="w-5 h-5 text-red-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-600" />,
};

const COLORS = {
  success: "bg-green-50 border-green-300 text-green-700",
  error: "bg-red-50 border-red-300 text-red-700",
  warning: "bg-yellow-50 border-yellow-300 text-yellow-700",
  info: "bg-blue-50 border-blue-300 text-blue-700",
};

export const CustomAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [modal, setModal] = useState<ReactNode | null>(null);

  const alert = (message: string, type: AlertType = "info") => {
    const id = ++alertId;
    setAlerts((prev) => [...prev, { id, type, message }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 4000);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const confirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      setModal(
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-bg-light rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <p className="mb-6 text-lg">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setModal(null);
                  resolve(true);
                }}
                className="btn-primary px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                OK
              </button>
              <button
                onClick={() => {
                  setModal(null);
                  resolve(false);
                }}
                className="btn-secondary px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  const either = (message: string, options: string[]) => {
    return new Promise<string>((resolve) => {
      setModal(
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-bg-light rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <p className="mb-6 text-lg">{message}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setModal(null);
                    resolve(opt);
                  }}
                  className="btn-primary px-5 py-2 rounded-md bg-accent-dark text-white hover:bg-custom-accent transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <AlertContext.Provider value={{ alert, confirm, either, alerts, removeAlert }}>
      {children}

      {/* Alertas flotantes en esquina superior derecha */}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-[10000] max-w-sm w-full">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-3 rounded-lg border p-3 shadow-lg animate-fadeInDown ${COLORS[a.type]}`}
          >
            <div>{ICONS[a.type]}</div>
            <p className="flex-1 text-sm font-medium select-none">{a.message}</p>
            <button
              onClick={() => removeAlert(a.id)}
              className="p-1 rounded hover:bg-gray-200 transition"
              aria-label="Cerrar alerta"
            >
              <X className="w-4 h-4 text-text" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal centrado */}
      {modal}
    </AlertContext.Provider>
  );
};

export const useCustomAlerts = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useCustomAlerts must be used within CustomAlertProvider");
  return ctx;
};

/* Agrega en tu CSS global (tailwind o css) esta animación para que se vea el fade y slide hacia abajo */

