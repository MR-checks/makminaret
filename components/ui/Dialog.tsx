"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  ({ className, open, onOpenChange, children, ...props }, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    // Expose the ref
    React.useImperativeHandle(ref, () => dialogRef.current!);

    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    }, [open]);

    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleClose = () => {
        onOpenChange?.(false);
      };

      dialog.addEventListener("close", handleClose);
      return () => dialog.removeEventListener("close", handleClose);
    }, [onOpenChange]);

    return (
      <dialog
        ref={dialogRef}
        className={cn(
          "backdrop:bg-[var(--ink)]/50", // Glassmorphism is banned, using plain semi-transparent dark overlay
          "m-auto rounded-md border border-[var(--rule)] bg-[var(--paper)] p-0 shadow-none outline-none", // No colored glow shadows
          "open:animate-in open:fade-in-0 open:zoom-in-95",
          "max-w-lg w-full",
          className
        )}
        {...props}
      >
        {children}
      </dialog>
    );
  }
);
Dialog.displayName = "Dialog";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b border-[var(--rule)]",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight font-display text-[var(--navy)]",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 text-[var(--ink-soft)] text-sm", className)}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-[var(--rule)]",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogCloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { onClick?: () => void }
>(({ className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.();
        // Automatically close native dialog if button is placed inside it
        const dialog = e.currentTarget.closest("dialog");
        dialog?.close();
      }}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-[var(--paper)] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] focus:ring-offset-2 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4 text-[var(--ink)]" />
      <span className="sr-only">Close</span>
    </button>
  );
});
DialogCloseButton.displayName = "DialogCloseButton";

export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogCloseButton,
};
