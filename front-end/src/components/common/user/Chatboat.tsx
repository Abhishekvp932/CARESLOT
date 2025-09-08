import { useState } from "react";
import { useChatBoatMutation } from "@/features/users/userApi";
import { useNavigate } from "react-router-dom";
export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! Tell me your symptoms and I’ll suggest a doctor." },
  ]);
  const [input, setInput] = useState("");

  const [chatBoat] = useChatBoatMutation();
  const navigate = useNavigate();
  const handleSend = async () => {
    if (!input.trim()) return;

 
    setMessages((prev) => [...prev, { role: "patient", text: input }]);

    try {
      const res = await chatBoat(input).unwrap();
      console.log("chat response", res);

    

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.message,
          doctors: res.doctors || [],
        },
      ]);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetailsPage = (doctorId:string)=>{
    navigate(`/doctor-details/${doctorId}`);
  }

  return (
    <div className="flex flex-col w-80 h-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-blue-500 text-white text-lg font-semibold px-4 py-3">
        CareSlot Assistant 💬
      </div>

      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "patient" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-[75%] ${
                msg.role === "patient"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p>{msg.text}</p>

             
              {msg?.doctors && msg?.doctors?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg?.doctors.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2 border border-gray-200"
                      onClick={()=>handleDetailsPage(doc?._id)}
                    >
                      <img
                        src={doc.profile_img}
                        alt={doc.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-sm">{doc.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

     
      <div className="flex border-t border-gray-200">
        <input
          className="flex-1 px-3 py-2 outline-none text-sm text-gray-900 border border-gray-300 rounded"
          type="text"
          placeholder="Type your symptom..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
