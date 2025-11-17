import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import AddSubscriptionModal from "@/components/common/admin/SubscriptionModal";
import { useCreateSubscriptionMutation} from "@/features/admin/adminApi";
import { handleApiError } from "@/utils/handleApiError";
import { useGetAllSubscriptionsQuery } from "@/features/admin/adminApi";
import { useDeleteSubscriptionMutation } from "@/features/admin/adminApi";
interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  discountAmount: number;
  durationInDays: number;
}

interface TableColumn<T> {
  label: string;
  accessor: string;
  render?: (item: T) => React.ReactNode;
}

const Subscriptions = () => {
  const [page, setPage] = useState<number>(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const {data=[],refetch} = useGetAllSubscriptionsQuery(undefined) ;
  console.log('subscription datas',data);
  const subscriptions = data || [];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

//   const limit = 10;

  const totalPages =  1;
 const [deleteSubscription] = useDeleteSubscriptionMutation();
  const handleDelete = async(subscriptionId:string) => {
   try {
    const res = await deleteSubscription(subscriptionId).unwrap();
    toast.success(res?.msg);
    refetch();
   } catch (error) {
    toast.error(handleApiError(error))
   }
  };

 const [createSubscription] = useCreateSubscriptionMutation();
 

  const handleCreatePlan = async (newPlan: {
  name: string;
  price: number;
  discountAmount: number;
  durationInDays: number;
}) => {
  try {
    const res = await createSubscription(newPlan).unwrap();
    toast.success(res?.msg);
    refetch();
  } catch (error) {
   toast.error(handleApiError(error));
  }
};

  const columns:TableColumn<SubscriptionPlan>[] = [
    { label: "Plan Name", accessor: "name" },
    {
      label: "Price",
      accessor: "price",
      render: (p: SubscriptionPlan) => `₹${p.price}`,
    },
    {
      label: "Discount",
      accessor: "discountAmount",
      render: (p: SubscriptionPlan) => `₹${p.discountAmount}`,
    },
    {
      label: "Duration",
      accessor: "durationInDays",
      render: (p: SubscriptionPlan) => `${p.durationInDays} days`,
    },
    {
      label: "Actions",
      accessor: "actions",
      render: (item: SubscriptionPlan) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedPlan(item);
              setConfirmOpen(true);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:opacity-90"
            type="button"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>

        <Button className="bg-black text-white hover:bg-black" onClick={()=>setIsAddModalOpen(true)}>
          <Plus size={16} />
          Add Subscription
        </Button>
      </div>
      <div>
        <CommonTableView
          title="Subscription Plans"
          data={subscriptions}
          columns={columns}
          withPagination={true}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />

        <CommonCardView
          data={subscriptions}
          withPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
          title="Subscription Plans"
          renderItem={(plan: SubscriptionPlan) => (
            <div className="flex justify-between items-start">
              <div>
                <p>
                  <strong>Plan:</strong> {plan.name}
                </p>
                <p>
                  <strong>Price:</strong> ₹{plan.price}
                </p>
                <p>
                  <strong>Discount:</strong> ₹{plan.discountAmount}
                </p>
                <p>
                  <strong>Duration:</strong> {plan.durationInDays} days
                </p>
              </div>
            </div>
          )}
        />
      </div>

      {selectedPlan && (
        <ConfirmationModal
          open={confirmOpen}
          title="Delete Subscription Plan?"
          description={`Are you sure you want to delete the ${selectedPlan.name} plan?`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onConfirm={() => {
            handleDelete(selectedPlan._id);
            setConfirmOpen(false);
            setSelectedPlan(null);
          }}
          onCancel={() => {
            setConfirmOpen(false);
            setSelectedPlan(null);
          }}
        />
      )}

      <AddSubscriptionModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleCreatePlan}
      />

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default Subscriptions;
