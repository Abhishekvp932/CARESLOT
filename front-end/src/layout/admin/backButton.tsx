import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-b">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="text-primary-foreground hover:bg-primary-foreground/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
    </div>
  );
}

export default BackButton;
