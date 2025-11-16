import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardPlus, Save } from "lucide-react";
import { useGetAppoinmentPrescriptionQuery } from "@/features/docotr/doctorApi";
import { toast, ToastContainer } from "react-toastify";

interface PrescriptionData {
  diagnosis: string;
  medicines: string;
  advice: string;
  appoinmentId: string;
  patientId: string;
}

interface PrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PrescriptionData, isEdit: boolean) => void;
  patientName: string | null;
  appoinmentId?: string | null;
  patientId?: string | null;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  open,
  onClose,
  onSubmit,
  patientName,
  appoinmentId,
  patientId,
}) => {
  // 1️⃣ Fetch from backend only the first time
  const { data } = useGetAppoinmentPrescriptionQuery(appoinmentId as string, {
    skip: !open || !appoinmentId,
  });

  // 2️⃣ Local state to store fetched data (we will NOT refetch)
  const [prescriptionData, setPrescriptionData] =
    useState<PrescriptionData | null>(null);

  // 3️⃣ Load backend data once and store in state
  useEffect(() => {
    if (data) {
      setPrescriptionData({
        appoinmentId: appoinmentId!,
        patientId: patientId!,
        diagnosis: data.diagnosis || "",
        medicines: data.medicines || "",
        advice: data.advice || "",
      });
    } else {
      setPrescriptionData({
        appoinmentId: appoinmentId!,
        patientId: patientId!,
        diagnosis: "",
        medicines: "",
        advice: "",
      });
    }
  }, [data, appoinmentId, patientId]);

  // 4️⃣ Keep form synced with local state
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    advice: "",
  });

  useEffect(() => {
    if (prescriptionData && open) {
      setForm({
        diagnosis: prescriptionData.diagnosis,
        medicines: prescriptionData.medicines,
        advice: prescriptionData.advice,
      });
    }
  }, [prescriptionData, open]);

  const isEditing = !!data; // true → update mode

  const [error, setError] = useState({
    diagnosis: "",
    medicines: "",
    advice: "",
  });

  const validate = () => {
    const newError = {
      diagnosis: "",
      medicines: "",
      advice: "",
    };

    let isValid = true;

    if (!form.diagnosis) {
      newError.diagnosis = "Diagnosis is required";
      isValid = false;
    }
    if (!form.medicines) {
      newError.medicines = "Medicines are required";
      isValid = false;
    }
    if (!form.advice) {
      newError.advice = "Advice is required";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const updatedData: PrescriptionData = {
      ...form,
      appoinmentId: appoinmentId!,
      patientId: patientId!,
    };

  if (
  updatedData.diagnosis === prescriptionData?.diagnosis &&
  updatedData.medicines === prescriptionData?.medicines &&
  updatedData.advice === prescriptionData?.advice
) {
  toast.info("No changes");
  return;
}

    // 5️⃣ Update parent (backend call)
    onSubmit(updatedData, isEditing);

    // 6️⃣ Update local state so UI does NOT refetch
    setPrescriptionData(updatedData);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-2xl shadow-xl">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="flex items-center gap-2 text-blue-600 text-xl font-semibold">
            <ClipboardPlus className="w-6 h-6" />
            {isEditing ? "Edit Prescription" : "Add Prescription"} for{" "}
            {patientName}
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
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              className="mt-1"
            />
            {error.diagnosis && (
              <p style={{ color: "red" }}>{error.diagnosis}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Medicines
            </label>
            <Textarea
              name="medicines"
              value={form.medicines}
              onChange={(e) => setForm({ ...form, medicines: e.target.value })}
              className="mt-1"
            />
            {error.medicines && (
              <p style={{ color: "red" }}>{error.medicines}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Advice</label>
            <Textarea
              name="advice"
              value={form.advice}
              onChange={(e) => setForm({ ...form, advice: e.target.value })}
              className="mt-1"
            />
            {error.advice && <p style={{ color: "red" }}>{error.advice}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEditing ? "Update Prescription" : "Save Prescription"}
            </Button>
          </div>
        </div>
      </DialogContent>
      <ToastContainer autoClose={200} />
    </Dialog>
  );
};

export default PrescriptionModal;
