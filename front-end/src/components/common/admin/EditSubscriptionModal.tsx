import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";

interface EditSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedPlan: {
    _id: string;
    price: number;
    discountAmount: number;
    durationInDays: number;
  }) => void;
  planData: {
    _id: string;
    price: number;
    discountAmount: number;
    durationInDays: number;
  } | null;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  open,
  onClose,
  onUpdate,
  planData,
}) => {
  const [price, setPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [durationInDays, setDurationInDays] = useState<number>(0);

  useEffect(() => {
    if (planData) {
      setPrice(planData.price);
      setDiscountAmount(planData.discountAmount);
      setDurationInDays(planData.durationInDays);
    }
  }, [planData]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!planData) return;
    if(price === 0) {
        toast.error('Invalid Price');
        return;
    }
    if(discountAmount === 0) {
        toast.error('Invalid Discount Amount');
        return;
    }

    if(durationInDays === 0) {
        toast.error('Invalid Time Duration');
        return;
    }
    onUpdate({
      _id: planData._id,
      price,
      discountAmount,
      durationInDays,
    });

    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Subscription</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Amount
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={durationInDays}
              onChange={(e) => setDurationInDays(Number(e.target.value))}
              min="1"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            className="bg-black text-white hover:bg-gray-800 px-6" 
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
      </div>
      <ToastContainer autoClose={200}/>
    </div>
  );
};

export default EditSubscriptionModal;