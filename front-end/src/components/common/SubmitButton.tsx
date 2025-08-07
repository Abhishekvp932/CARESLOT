import {Button} from '@/components/ui/button'
// import { boolean } from 'yup';
import {Loader2} from 'lucide-react'

type SubmitButtonProps = {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  isLoading?:boolean;
  
};

export const SubmitButton = ({
    label = "Submit",
    onClick,
    disabled = false,
    type = "submit",
    isLoading = false
} : SubmitButtonProps)=>{
   return (
    <Button type={type} className='w-full' onClick = {onClick} disabled ={disabled || isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
   )
}