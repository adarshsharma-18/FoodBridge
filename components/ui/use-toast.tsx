"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

type ToastProps = {
  title: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
  duration?: number
}

type ToastState = ToastProps & {
  id: string
  visible: boolean
}

let toastCounter = 0
const toasts: ToastState[] = []
let setToastsState: React.Dispatch<React.SetStateAction<ToastState[]>> | null = null

export function Toaster() {
  const [toastsState, setToastsStateLocal] = useState<ToastState[]>([])

  useEffect(() => {
    setToastsState = setToastsStateLocal
    return () => {
      setToastsState = null
    }
  }, [])

  const removeToast = (id: string) => {
    setToastsStateLocal((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toastsState.map((toast) => (
        <div
          key={toast.id}
          className={`bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
            toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          } ${
            toast.type === "success"
              ? "border-l-4 border-green-500"
              : toast.type === "error"
                ? "border-l-4 border-red-500"
                : toast.type === "warning"
                  ? "border-l-4 border-amber-500"
                  : "border-l-4 border-blue-500"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm text-gray-500 mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function toast(props: ToastProps) {
  const id = `toast-${toastCounter++}`
  const toast: ToastState = {
    ...props,
    id,
    visible: false,
    type: props.type || "default",
    duration: props.duration || 5000,
  }

  // Add toast to state
  if (setToastsState) {
    setToastsState((prev) => [...prev, toast])

    // Make toast visible after a small delay (for animation)
    setTimeout(() => {
      setToastsState?.((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)))
    }, 10)

    // Remove toast after duration
    setTimeout(() => {
      setToastsState?.((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

      // Remove from DOM after animation completes
      setTimeout(() => {
        setToastsState?.((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, toast.duration)
  }
}
