import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";

import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { InputField } from "./InputField";
import { userEdit } from "@/validation/userEdit.schema";
import { z } from "zod";

const EditUserModal = ({
  user,
  onSave,
}: {
  user: any;
  onSave: (updatedUser) => void;
}) => {
  const [formData, setFormData] = useState({ ...user });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImg: file });
      setErrors((prev) => ({ ...prev, profileImg: "" }));
    }
  };

  const handleSaveClick = () => {
    try {
      const parsedData = userEdit.parse({
        ...formData,
        dob:
          typeof formData.dob === "string" ? formData.dob : formData.DOB || "",
      });

      setErrors({});
      onSave(parsedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path.length > 0) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <DialogTitle>Edit User</DialogTitle>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <label className="font-medium">Add your profile pic</label>
          <InputField
            type="file"
            label="Profile Image"
            name="profileImg"
            placeholder="Add your image"
            onChange={handleFileChange}
          />
          {errors.profileImg && (
            <p className="text-red-500 text-sm mt-1">{errors.profileImg}</p>
          )}

          {formData.profileImg && typeof formData.profileImg !== "string" && (
            <img
              src={URL.createObjectURL(formData.profileImg)}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}

          <InputField
            name="name"
            label="Name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Enter name"
            error={errors.name}
          />
          <InputField
            name="email"
            label="Email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Enter email"
            error={errors.email}
          />
          <InputField
            name="phone"
            label="Phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Enter phone"
            error={errors.phone}
          />
          <label htmlFor="gender" className="font-medium">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}

          <InputField
            type="date"
            label="Date of Birth"
            name="dob"
            value={
              formData.dob
                ? formData.dob.split
                  ? formData.dob.split("T")[0]
                  : formData.dob
                : ""
            }
            onChange={handleChange}
            placeholder="Enter Date of birth"
            error={errors.dob}
          />
        </div>

        <DialogFooter>
          <DialogClose>
            <Button onClick={handleSaveClick}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
