// src/components/common/ConfirmationModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;   // NEW
  cancelText?: string;    // NEW
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="mt-2 text-gray-700">{description}</p>

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className="bg-black text-white" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
