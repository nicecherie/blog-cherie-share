import { cn } from "@/lib/utils";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type: string;
}
export function Input({className, type,  ...props}: InputProps) {
  return (
    <input type={type} className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed", className)} {...props}></input>
  )
}