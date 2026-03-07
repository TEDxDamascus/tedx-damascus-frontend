import { useEffect } from "react"
import { X, Trash2 } from "lucide-react"
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Item",
  description = "Are you sure you want to delete this item?",
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose, loading])

  if (!open) return null

  const handleClose = () => {
    if (!loading) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Trash2 size={18} className="text-red-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <button
            onClick={handleClose}
            disabled={loading}
            className=" text-gray-400 hover:text-gray-700 transition">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <p className="mt-4 text-sm text-gray-600">{description}</p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2
        rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2
        px-4 py-2
        rounded-2xl bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
            {loading ?
              "Deleting..."
            : <>
                <Trash2 size={14} />
                Delete
              </>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
