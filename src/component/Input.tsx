import type { HTMLInputTypeAttribute } from "react"
import { cn } from "../utils/cn"

type InputParams = {
    value?: string,
    placeholder?: string,
    type?: HTMLInputTypeAttribute,
    className: string,
    errors?: string[],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({ value, placeholder, type, className, errors, onChange }: InputParams) => {
    return <div>
        <input placeholder={placeholder} value={value} type={type} onChange={onChange} className={cn(className, {
            "outline-red-500": errors?.length
        })} />
        {errors?.map(value => <p className="text-red-500">{value}</p>)}
    </div>
}

export default Input