// components/doctor/SaveCancelButtons.tsx
import { Save } from "lucide-react";

interface Props {
  onSave: () => void;
}

export default function SaveCancelButtons({ onSave }: Props) {
  return (
    <div className="bg-gray-50 px-8 py-6 flex justify-end space-x-4">
      <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </button>
    </div>
  );
}
