import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave:(reason:string)=> void;
  title:string;
}

export default function RejectionReasonModal({ open, onOpenChange,onSave,title}: ModalProps) {
  const [reason,setReason] = useState('');
  const handleSave = ()=>{
    console.log('reason',reason);
     onSave(reason);
     onOpenChange(false);
     setReason('');
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <Input onChange={(e)=> setReason(e.target.value)} placeholder="Enter the reason ...."/>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Close
          </Button>
          <Button  onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
