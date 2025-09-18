import { useState } from "react";
import { useChatBoatMutation } from "@/features/users/userApi";
export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! Tell me your symptoms and I’ll suggest a doctor." },
  ]);
  const [input, setInput] = useState("");

  const [chatBoat,{isLoading}] = useChatBoatMutation();
 
  const handleSend = async () => {
    if (!input.trim()) return;

 
    setMessages((prev) => [...prev, { role: "patient", text: input }]);

    try {
      setInput("");
      const res = await chatBoat(input).unwrap();
      console.log("chat response", res);

    

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.replay
        },
      ]);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const loading = isLoading;

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
            </div>
          </div>
        ))}
            {loading && (
            <div className="flex justify-start">
        <div className="px-3 py-2 rounded-xl max-w-[75%] bg-gray-200 text-gray-900 flex items-center space-x-1">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-150">.</span>
          <span className="animate-pulse delay-300">.</span>
        </div>
      </div>

      )}
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
