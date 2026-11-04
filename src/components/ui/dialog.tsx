import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from 'cn'

const Dialog = DialogPrimitive

type DialogContentProps = React.ComponentProps<
    typeof DialogPrimitive.Popup
>

function DialogContent({
    className,
    children,
    ...props
}: DialogContentProps) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity" />

            <DialogPrimitive.Popup
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#E8E8DF] bg-white p-6 shadow-xl outline-none',
                    'max-h-[85vh] overflow-y-auto',
                    className,
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
    )
}

function DialogHeader({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('mb-5 space-y-1', className)}
            {...props}
        />
    )
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            className={cn(
                'text-lg font-semibold text-[#315B46]',
                className,
            )}
            {...props}
        />
    )
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            className={cn('text-sm text-[#718075]', className)}
            {...props}
        />
    )
}

function DialogFooter({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'mt-6 flex flex-wrap justify-end gap-3',
                className,
            )}
            {...props}
        />
    )
}

export {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
}