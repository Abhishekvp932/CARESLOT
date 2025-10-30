import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/validation/user.schema";
import { z } from "zod";
import { InputField } from "@/components/common/InputField";

// Define inferred type from Zod schema
type UserFormData = z.infer<typeof userSchema>;

const AddUserModal = ({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newUser: UserFormData) => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      DOB: "",
      profileImg: null,
      password: "",
      confirmPassword: "",
      role: "patients", // or set it dynamically
    },
  });

  const profileImg = watch("profileImg");

  const onSubmit = (data: UserFormData) => {
    onSave(data); // Parent will close modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent   className="max-w-md w-full"
  style={{ maxHeight: "80vh", overflowY: "auto" }}>
    
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Profile pic */}
            <InputField
              type="file"
              name = "profileImg"
              label="Profile photo"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setValue("profileImg", file);
              }}
            />
            {profileImg && typeof profileImg !== "string" && (
              <img
                src={URL.createObjectURL(profileImg)}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}

            {/* Name, Email, Phone */}
            <label htmlFor="">Name</label>
            <Input placeholder="Enter name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
             <label htmlFor="">Email</label>
            <Input placeholder="Enter email" {...register("email")} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
             <label htmlFor="">Phone</label>
            <Input placeholder="Enter phone" {...register("phone")} />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

            {/* Gender */}
             <label htmlFor="">Select Gender</label>
            <select {...register("gender")} className="border p-2 rounded w-full">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Other</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}

            {/* DOB */}
             <label htmlFor="">Date of birth</label>
            <Input type="date" {...register("DOB")} />
            {errors.DOB && <p className="text-red-500">{errors.DOB.message}</p>}

            {/* Password */}
             <label htmlFor="">Password</label>
            <Input placeholder="Enter Password" {...register("password")} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
               <label htmlFor="">confirm Password</label>
            <Input placeholder="Confirm Password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
           <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default AddUserModal;
