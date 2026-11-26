import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

// Like tabs.tsx: these keep only Base UI's behavior (focus, Esc, scroll lock),
// and each dialog writes its own classes.
//
// Layers: the page's own layers (tab bars, sticky headers, bottom bars) stay
// at z-5 or below; dialogs are z-40, above all of them; toasts, popovers and
// menus are z-50, so a toast still shows over a dialog.

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogBackdrop({
  className,
  ...props
}: Omit<DialogPrimitive.Backdrop.Props, 'className'> & { className?: string }) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={`z-40 ${className ?? ''}`}
      {...props}
    />
  )
}

function DialogPopup({
  className,
  ...props
}: Omit<DialogPrimitive.Popup.Props, 'className'> & { className?: string }) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={`z-40 ${className ?? ''}`}
      {...props}
    />
  )
}

function DialogTitle(props: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" {...props} />
}

function DialogDescription(props: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description data-slot="dialog-description" {...props} />
  )
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
