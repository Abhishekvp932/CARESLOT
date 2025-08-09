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
import { Input } from "../ui/input";
import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
 import { InputField } from "./InputField";
const EditUserModal = ({
  user,
  onSave,
}: {
  user: any;
  onSave: (updatedUser: any) => void;
}) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

        {/* InputField
                  type="password"
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                /> */}

        <div className="grid gap-4 py-4">
          <label htmlFor="">Add your profile pic</label>
          <InputField
            type="file"
            label="profile image"
            name="profileImg"
            placeholder="Add your image"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({ ...formData, profileImg: file });
              }
            }}
          />

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
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
          <InputField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <InputField
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone"
          />
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>
          </select>
          <InputField
            type="date"
            label="Date of Brith"
            name="dob"
            value={formData.DOB?.split("T")[0] || ""}
            onChange={handleChange}
            placeholder="Enter Date of birth"
          />
        </div>

        <DialogFooter>
          <DialogClose>
            <Button onClick={() => onSave(formData)}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
