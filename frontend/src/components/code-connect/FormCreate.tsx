import { useState, FormEvent } from "react";
import {
  contentTechsFrontCodeConnect,
  contentTechsBackCodeConnect,
} from "./techsLabelsContent";
import { IntCodeConnect } from "../../types";
import { CreateCodeConnectPayload } from "../../types/CodeConnectProject";
import { createCodeConnect } from "../../api/endPointCodeConnect";
import { formatDocumentIcons } from "../../icons/formatDocumentIconsArray";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const FormCreate = () => {
  const [formData, setFormData] = useState<IntCodeConnect>({
    title: "",
    techsFront: [],
    techsBack: [],
    description: "",
    numberDevsFront: 0,
    numberDevsBack: 0,
    time: 0,
    unitTime: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Changed
  const allowedLanguages = new Set([
    "PHP",
    "JavaScript",
    "Java",
    "React",
    "TypeScript",
    "Python",
    "SQL",
  ]);

  // Changed (alineat amb techsLabelsContent actual)
  const frontendLabelToApiValue: Record<string, string> = {
    React: "React",
    Angular: "TypeScript",
    Svelte: "JavaScript",
    Vue: "JavaScript",
    JavaScript: "JavaScript",
  };

  // Changed (alineat amb techsLabelsContent actual)
  const backendLabelToApiValue: Record<string, string> = {
    Node: "JavaScript",
    PHP: "PHP",
    Java: "Java",
    Python: "Python",
    SQL: "SQL",
  };

  // Changed
  const getFrontendApiValue = (label: string) =>
    frontendLabelToApiValue[label] ?? "";

  // Changed
  const getBackendApiValue = (label: string) =>
    backendLabelToApiValue[label] ?? "";

  // Changed
  const isFrontendDisabled = (label: string) => {
    const apiValue = getFrontendApiValue(label);
    return !apiValue || !allowedLanguages.has(apiValue);
  };

  // Changed
  const isBackendDisabled = (label: string) => {
    const apiValue = getBackendApiValue(label);
    return !apiValue || !allowedLanguages.has(apiValue);
  };

  // Changed
  const buildTimeDuration = () => {
    const timeValue = formData.time;
    const unitValue = formData.unitTime;

    if (!timeValue || !unitValue) return "";

    if (unitValue === "month") {
      return `${timeValue} ${timeValue === 1 ? "month" : "months"}`;
    }
    if (unitValue === "week") {
      return `${timeValue} ${timeValue === 1 ? "week" : "weeks"}`;
    }
    return "";
  };

  // Changed (single select guardant el label)
  const handleTechsFrontToggle = (label: string) => {
    if (isFrontendDisabled(label)) return;

    setFormData((prev) => {
      const isSelected = prev.techsFront[0] === label;
      return { ...prev, techsFront: isSelected ? [] : [label] };
    });
  };

  // Changed (single select guardant el label)
  const handleTechsBackToggle = (label: string) => {
    if (isBackendDisabled(label)) return;

    setFormData((prev) => {
      const isSelected = prev.techsBack[0] === label;
      return { ...prev, techsBack: isSelected ? [] : [label] };
    });
  };

  const handleInputText = (
    field: keyof Pick<IntCodeConnect, "title" | "description" | "unitTime">,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputsNumber = (
    field: keyof Pick<
      IntCodeConnect,
      "numberDevsFront" | "numberDevsBack" | "time"
    >,
    rawValue: string,
  ) => {
    if (rawValue === "") {
      return setFormData((prev) => ({ ...prev, [field]: 0 }));
    }

    const value = Number(rawValue);
    if (!isNaN(value) && value >= 0) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDeadLine = (
    field: keyof Pick<IntCodeConnect, "deadline">,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const {
      title,
      techsFront,
      techsBack,
      description,
      numberDevsFront,
      numberDevsBack,
      time,
      unitTime,
      deadline,
    } = formData;

    const timeDuration = buildTimeDuration();

    // Changed (validem també que el mapping existeix)
    const frontendApiValue = getFrontendApiValue(techsFront[0] ?? "");
    const backendApiValue = getBackendApiValue(techsBack[0] ?? "");

    if (
      !title.trim() ||
      techsFront.length === 0 ||
      techsBack.length === 0 ||
      !description.trim() ||
      numberDevsFront <= 0 ||
      numberDevsBack <= 0 ||
      time <= 0 ||
      !unitTime.trim() ||
      !deadline ||
      !timeDuration ||
      !frontendApiValue ||
      !backendApiValue
    ) {
      toast.error("Completa tots els camps obligatoris.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const timeDuration = buildTimeDuration();

    // Changed (map label -> valor que accepta el back)
    const selectedFrontLabel = formData.techsFront[0] ?? "";
    const selectedBackLabel = formData.techsBack[0] ?? "";

    const apiPayload: CreateCodeConnectPayload = {
      title: formData.title,
      time_duration: timeDuration,
      language_frontend: getFrontendApiValue(selectedFrontLabel),
      language_backend: getBackendApiValue(selectedBackLabel),
    };

    try {
      await createCodeConnect(apiPayload); // Changed (sense casts)
      toast.success("Code Connect publicat amb exit");
      navigate("/codeconnect");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error en publicar Code Connect");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col lg:flex-row justify-between">
        <div>
          <a
            className="text-[#B91879] cursor-pointer text-sm"
            onClick={() => navigate("/codeconnect")}
          >
            <ArrowLeftIcon
              className="inline text-[#B91879] mb-2 me-1"
              size="16px"
            ></ArrowLeftIcon>
            Tornar a Code Connect
          </a>
          <h2 className="text-2xl font-semibold mt-2">Nou Code Connect</h2>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end lg:gap-4 mt-6 lg:mt-0">
          <button
            onClick={() => navigate("/codeconnect")}
            disabled={isSubmitting}
            type="button"
            className="px-4 py-2 mb-4 border border-gray-400 rounded-lg hover:shadow-md cursor-pointer lg:w-1/2 lg:mb-0"
          >
            Cancel·lar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-md cursor-pointer lg:w-1/2"
          >
            {isSubmitting ? "Publicant..." : "Publicar"}
          </button>
        </div>
      </div>

      <div className="mx-[-3.7rem] border-t border-gray-300 my-8"></div>

      <div className="flex flex-col lg:w-1/2">
        <label htmlFor="title" className="block mb-2 mt-8 font-medium">
          Títol *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          required
          onChange={(e) => handleInputText("title", e.target.value)}
          disabled={isSubmitting}
          className="p-2 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg mb-4"
          maxLength={65}
        />
        <div className="self-end text-sm text-gray-500">
          <span>{formData.title.length}/65</span>
        </div>
      </div>

      <fieldset disabled={isSubmitting}>
        <label className="block mb-2 font-medium">Tecnologia Frontend *</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {contentTechsFrontCodeConnect.map((item) => {
            const IconComponent = item.icon;

            const disabled = isFrontendDisabled(item.label);
            // Changed (selected compara label, no api value)
            const isSelected = formData.techsFront[0] === item.label;

            return (
              <label
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                  disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                } ${
                  isSelected
                    ? "border-3 border-[#B91879] bg-white text-black"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                <input
                  type="checkbox"
                  name="techsFront[]"
                  value={item.label}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => handleTechsFrontToggle(item.label)}
                  className="sr-only"
                />
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset disabled={isSubmitting}>
        <label className="block mb-2 font-medium">Tecnologia Backend*</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {contentTechsBackCodeConnect.map((item) => {
            const IconComponent = item.icon;

            const disabled = isBackendDisabled(item.label);
            // Changed (selected compara label, no api value)
            const isSelected = formData.techsBack[0] === item.label;

            return (
              <label
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                  disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                } ${
                  isSelected
                    ? "border-3 border-[#B91879] bg-white text-black"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                <input
                  type="checkbox"
                  name="techsBack[]"
                  value={item.label}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => handleTechsBackToggle(item.label)}
                  className="sr-only"
                />
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mx-[-3.7rem] border-t border-gray-300 my-8"></div>

      <div className="lg:w-2/3">
        <label htmlFor="description" className="block my-4 mb-8 font-medium">
          Descripció *
        </label>
        <div className="flex flex-col">
          <span className="w-full flex gap-10 p-2 px-5 border border-gray-600 rounded-tl-lg rounded-tr-lg">
            {formatDocumentIcons.map((btn) => {
              const IconComponent = btn.icon;
              return <IconComponent key={btn.label} className="w-5 h-5" />;
            })}
          </span>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            required
            onChange={(e) => handleInputText("description", e.target.value)}
            disabled={isSubmitting}
            maxLength={1000}
            className="w-full min-h-[350px] p-2 border border-gray-600 rounded-bl-lg rounded-br-lg border-t-0 mb-4 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879]"
          />
          <div className="flex w-full justify-end me-10 text-sm text-gray-500">
            <span className="self-end">{formData.description.length}/1000</span>
          </div>
        </div>
      </div>

      <div className="lg:w-2/3 my-4">
        <div className="grid gap-4 lg:grid-cols-3 items-center">
          <label htmlFor="deadline" className="block font-medium">
            Data límit d'inscripció *
          </label>
          <input
            id="deadline"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg py-2 px-4"
            type="date"
            value={formData.deadline || ""}
            required
            disabled={isSubmitting}
            onChange={(e) => handleDeadLine("deadline", e.target.value)}
            min="2023-01-01"
          />
        </div>
      </div>

      <div className="lg:w-2/3 my-8">
        <div className="grid gap-4 lg:grid-cols-3 items-center">
          <label htmlFor="time" className="block font-medium">
            Durada del projecte *
          </label>
          <div className="flex lg:col-start-2 lg:col-span-1">
            <input
              id="time"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-t border-b border-l border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-tl-lg rounded-bl-lg py-2 px-4 w-11"
              type="number"
              value={formData.time === 0 ? "" : formData.time}
              placeholder="0"
              required
              onChange={(e) => handleInputsNumber("time", e.target.value)}
            />
            <label
              htmlFor="unitTime"
              className="block my-4 mb-4 font-medium sr-only"
            >
              Tipus durada *
            </label>
            <select
              id="unitTime"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-gray-100 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-tr-lg rounded-br-lg py-2 px-4 w-full"
              value={formData.unitTime}
              required
              disabled={isSubmitting}
              onChange={(e) => handleInputText("unitTime", e.target.value)}
            >
              <option value="" disabled>
                Selecciona
              </option>
              <option value="month">Mes</option>
              <option value="week">Setmana</option>
            </select>
          </div>
        </div>
      </div>

      <div className="lg:w-2/3 my-8">
        <div className="grid gap-4 items-center lg:grid-cols-3">
          <label htmlFor="devs-front" className="block font-medium col-span-2">
            Nombre de programadors frontend *
          </label>
          <input
            id="devs-front"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg py-2 px-4 w-full lg:w-11"
            type="number"
            value={
              formData.numberDevsFront === 0 ? "" : formData.numberDevsFront
            }
            placeholder="0"
            onChange={(e) =>
              handleInputsNumber("numberDevsFront", e.target.value)
            }
          />
        </div>
      </div>

      <div className="lg:w-2/3 my-8">
        <div className="grid gap-4 items-center lg:grid-cols-3">
          <label htmlFor="devs-back" className="block font-medium col-span-2">
            Nombre de programadors backend *
          </label>
          <input
            id="devs-back"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg py-2 px-4 w-full lg:w-11"
            type="number"
            value={formData.numberDevsBack === 0 ? "" : formData.numberDevsBack}
            placeholder="0"
            onChange={(e) =>
              handleInputsNumber("numberDevsBack", e.target.value)
            }
          />
        </div>
      </div>
    </form>
  );
};

export default FormCreate;
