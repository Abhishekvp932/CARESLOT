import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ClipboardPlus, Save } from "lucide-react";
interface PrescriptionData {
    diagnosis:string;
    medicines:string;
    advice:string;
}
interface PrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data:PrescriptionData) => void;
  patientName: string | null;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  open,
  onClose,
  onSubmit,
  patientName,
}) => {
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    advice: "",
  });
  const [error, setError] = useState({
    diagnosis: "",
    medicines: "",
    advice: "",
  });

  const validate = () => {
    let isValid = true;
    const newError = {
      diagnosis: "",
      medicines: "",
      advice: "",
    };

    if(!form.diagnosis){
        newError.diagnosis = 'diagnsis is required'
        isValid = false;
    }
    if(!form.medicines){
        newError.medicines = 'medicines is required'
        isValid = false;
    }
    if(!form.advice){
        newError.advice = 'advice is required'
        isValid = false;
    }
    setError(newError);
    return isValid;
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if(validate()){
        onSubmit(form);
         onClose();
         setForm({
             diagnosis: "",
           medicines: "",
            advice: "",
         })
    }
   
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-2xl shadow-xl">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="flex items-center gap-2 text-blue-600 text-xl font-semibold">
            <ClipboardPlus className="w-6 h-6" /> Prescription for {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <Textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis or symptoms..."
              className="mt-1"
            />
            {error && <p style={{color:'red'}}>{error.diagnosis}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Medicines
            </label>
            <Textarea
              name="medicines"
              value={form.medicines}
              onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg - twice a day after food"
              className="mt-1"
            />
                 {error && <p style={{color:'red'}}>{error.medicines}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Advice</label>
            <Textarea
              name="advice"
              value={form.advice}
              onChange={handleChange}
              placeholder="e.g. Take rest, drink plenty of water..."
              className="mt-1"
            />
            {error && <p style={{color:'red'}}>{error.advice}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Prescription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionModal;
