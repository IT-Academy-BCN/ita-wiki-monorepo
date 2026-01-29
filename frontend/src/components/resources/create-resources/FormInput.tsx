import { UseFormRegister } from "react-hook-form";
import { IntResource } from "../../../types";

interface FormInputProps {
  id: keyof IntResource;
  label: string;
  placeholder: string;
  register: UseFormRegister<Partial<IntResource>>;
  errors?: string;
  className?: string;
  maxLength?: number;
  limitedText?: boolean;
  textLength?: number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  id,
  label,
  placeholder,
  register,
  errors,
  className,
  maxLength,
  limitedText = false,
  textLength,
  onChange,
}: FormInputProps) {
  return (
    <>
      <label htmlFor={id} className="text-sm text-black font-medium block mb-2">{label}</label>
      <div className="max-w-[482px] space-y-2">
        <input
          type="text"
          id={id}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full px-4 py-4 border text-base
            border-gray-300 focus:border-[#B91879] 
            rounded-lg placeholder:font-medium outline-[#B91879] 
            ${className}
          `}
          {...(register(id),
          {
            onChange: (e) => {
              onChange?.(e);
            },
          })}
        />
        <div className="flex justify-between">
          <div className="flex justify-start">
            {errors && <p className="text-red-500 text-xs">{errors}</p>}
          </div>
          {
            limitedText && 
            <div className="flex justify-end">
              <p className="text-sm text-slate-600 text-right">
                {textLength}/{maxLength}
              </p>
            </div>
          }
        </div>
      </div>
    </>
  );
}
