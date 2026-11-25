import { Toast as ToastPrimitive } from '@base-ui/react/toast'

// From `shadcn add toast`, trimmed like dialog.tsx: no aria-*, no icon, action
// or close button, and the project's own look instead of shadcn's.
// Show one from anywhere with toast.add({ title, timeout }).
const toast = ToastPrimitive.createToastManager()

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <ToastPrimitive.Root
      key={toastItem.id}
      toast={toastItem}
      data-slot="toast"
      className="bg-ink text-on-role shadow-overlay pointer-events-auto rounded-md px-4 py-2 transition-[opacity,translate] duration-200 ease-out data-ending-style:-translate-y-2 data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:opacity-0 motion-reduce:transition-none"
    >
      {/* Renders an h2, so a class is needed over the h2 default in index.css */}
      <ToastPrimitive.Title data-slot="toast-title" className="text-label" />
    </ToastPrimitive.Root>
  ))
}

// Top center, 12px below the header (min-h-15, tablet:min-h-17)
function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toast}>
      <ToastPrimitive.Portal data-slot="toast-portal">
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          className="tablet:top-20 pointer-events-none fixed inset-x-4 top-18 z-50 flex flex-col items-center gap-2"
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}

export { Toaster, toast }
