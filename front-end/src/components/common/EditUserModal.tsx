    import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
    } from "@/components/ui/dialog";

    import { Button } from "../ui/button";
    import { Input } from "../ui/input";
    import { useState } from "react";
    import { DialogDescription } from "@radix-ui/react-dialog";

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

            <div className="grid gap-4 py-4">
                <label htmlFor="">Add your profile pic</label>
                <Input
                type="file"
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
            <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
            />
            <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
            />
            <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
            />
            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>

            </select>
            <Input
                type="date"
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
