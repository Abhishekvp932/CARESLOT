import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (plan: {
    name: string;
    price: number;
    discountAmount: number;
    durationInDays: number;
  }) => void;
}

const planOptions = ["Silver", "Gold", "Platinum"];

const AddSubscriptionModal = ({ open, onClose, onAdd }: Props) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    discountAmount: "",
    durationInDays: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    discountAmount: "",
    durationInDays: "",
  });

  const validate = (name: string, value: string) => {
    let error = "";

    if (!value) {
      error = "This field is required";
    } else if (
      ["price", "discountAmount", "durationInDays"].includes(name) &&
      Number(value) <= 0
    ) {
      error = "Value must be greater than 0";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  const isFormValid = Object.values(errors).every((e) => e === "") &&
    Object.values(form).every((v) => v !== "");

  const handleSubmit = () => {
    if (!isFormValid) {
      toast.error("Please fix the errors first");
      return;
    }

    onAdd({
      name: form.name,
      price: Number(form.price),
      discountAmount: Number(form.discountAmount),
      durationInDays: Number(form.durationInDays),
    });
    onClose();

    setForm({
      name: "",
      price: "",
      discountAmount: "",
      durationInDays: "",
    });

    setErrors({
      name: "",
      price: "",
      discountAmount: "",
      durationInDays: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Subscription Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* PLAN NAME DROPDOWN */}
          <div>
            <label className="text-sm font-medium">Plan Name</label>
            <select
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded mt-1 bg-white ${
                errors.name ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Plan</option>
              {planOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={`w-full p-2 border rounded mt-1 ${
                errors.price ? "border-red-500" : ""
              }`}
              placeholder="399"
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          </div>

          {/* DISCOUNT */}
          <div>
            <label className="text-sm font-medium">Discount Amount (₹)</label>
            <input
              type="number"
              name="discountAmount"
              value={form.discountAmount}
              onChange={handleChange}
              className={`w-full p-2 border rounded mt-1 ${
                errors.discountAmount ? "border-red-500" : ""
              }`}
              placeholder="100"
            />
            {errors.discountAmount && (
              <p className="text-red-500 text-xs">{errors.discountAmount}</p>
            )}
          </div>

          {/* DURATION */}
          <div>
            <label className="text-sm font-medium">Duration (Days)</label>
            <input
              type="number"
              name="durationInDays"
              value={form.durationInDays}
              onChange={handleChange}
              className={`w-full p-2 border rounded mt-1 ${
                errors.durationInDays ? "border-red-500" : ""
              }`}
              placeholder="30"
            />
            {errors.durationInDays && (
              <p className="text-red-500 text-xs">{errors.durationInDays}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              className="bg-black text-white"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Add Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
