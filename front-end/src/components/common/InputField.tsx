import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputFieldsProps = {
    label:string;
    name : string;
    type?:string;
    value?:string;
    onChange:(e:React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?:string;
    error?:string
};

export const InputField = ({
    label,
    name,
    type ='text',
    value,
    onChange,
    placeholder,
    error,
}:InputFieldsProps)=>{
    return (
         <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
    )
}