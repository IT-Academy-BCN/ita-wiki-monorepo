import { Control, Controller, FieldErrors } from "react-hook-form";
import type { TechnicalTestFormData } from "../../types/TechnicalTest";
import { FC, SVGProps } from "react";

type SvgIcon = FC<SVGProps<SVGSVGElement>>;

interface LanguageSelectorProps {
  control: Control<TechnicalTestFormData>;
  errors: FieldErrors<TechnicalTestFormData>;
  languages: { icon: SvgIcon; label: string }[];
}

const LanguageSelectorInput = ({
  control,
  errors,
  languages,
}: LanguageSelectorProps) => {
  return (
    <div className="px-10">
      <label className="block text-sm text-black font-medium mb-2">
        Llenguatge *
      </label>
      <Controller
        name="language"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-3 mb-4">
            {languages.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = field.value === cat.label;
              return (
                <button
                 key={cat.label}
                 type="button"
                 onClick={() => field.onChange(cat.label)}
                className={`w-[110px] h-[57px] px-2 py-4 rounded-[8px] border-2 outline-none text-sm font-medium flex items-center justify-center gap-2
                ${
                field.value === cat.label
                ? "border-[#B91879]"
                : "border-gray-300"
                }
                focus-visible:border-[#B91879] focus-visible:ring-0`}
>
  <IconComponent className="w-5 h-5" />
  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      />
      {errors.language && (
        <div className="py-4">
          <p className="text-red-500 text-xs">{errors.language.message}</p>
        </div>
      )}
    </div>
  );
};

export default LanguageSelectorInput;
