import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // Prevent body scroll when modal is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm">
      <div
        className="bg-surface w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/50">
          <h2
            id={titleId}
            className="text-xl font-semibold text-on-surface"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>

        {footer && (
          <div className="p-6 border-t border-outline-variant/50 bg-surface-container-lowest flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
};
