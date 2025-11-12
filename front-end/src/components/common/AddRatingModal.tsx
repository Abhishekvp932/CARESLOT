"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface AddRatingModalProps {
  doctorId: string;
  doctorName: string;
  onSubmit?: (rating: number, review: string) => void;
}

interface StarRatingProps {
  value: number;
  onRate?: (rating: number) => void;
  onHover?: (rating: number) => void;
  interactive?: boolean;
}

const AddRatingModal = ({
  doctorId,
  doctorName,
  onSubmit,
}: AddRatingModalProps) => {
  console.log(doctorId);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmitRating = () => {
    if (onSubmit) {
      onSubmit(rating, review);
    }

    setRating(0);
    setReview("");
    setIsOpen(false);
  };

  const StarRating = ({
    value,
    onRate,
    onHover,
    interactive = false,
  }: StarRatingProps) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              interactive ? "cursor-pointer" : ""
            } transition-colors ${
              star <= (interactive ? hoverRating || value : value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && onHover && onHover(star)}
            onMouseLeave={() => interactive && onHover && onHover(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg bg-blue-600 hover:bg-blue-700">
          <Star className="w-4 h-4 mr-2" />
          Add Rating
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Share your experience with Dr. {doctorName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex justify-center">
              <StarRating
                value={rating}
                onRate={setRating}
                onHover={setHoverRating}
                interactive={true}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRating}
            disabled={rating === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRatingModal;
