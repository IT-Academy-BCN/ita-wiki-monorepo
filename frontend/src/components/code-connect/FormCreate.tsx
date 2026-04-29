import { ArrowLeftIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { createCodeConnect } from "../../api/endPointCodeConnect";
import { formatDocumentIcons } from "../../icons/formatDocumentIconsArray";
import { IntCodeConnect } from "../../types";
import {
  contentTechsBackCodeConnect,
  contentTechsFrontCodeConnect,
} from "./techsLabelsContent";

const FormCreate = () => {
  const [formData, setFormData] = useState<
    Omit<IntCodeConnect, "time_duration">
  >({
    title: "",
    language_frontend: "",
    language_backend: "",
    description: "",
    programming_role: "",
    numberDevsFront: 0,
    numberDevsBack: 0,
    time: 0,
    unitTime: "",
    limit_date_inscription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputText = (field: keyof IntCodeConnect, value: string) => {
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
    field: keyof Pick<IntCodeConnect, "limit_date_inscription">,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const {
      title,
      language_frontend,
      language_backend,
      description,
      programming_role,
      numberDevsFront,
      numberDevsBack,
      time,
      unitTime,
      limit_date_inscription,
    } = formData;

    console.log(formData);
    if (!language_frontend) {
      toast.error("Selecciona una tecnologia frontend.");
      return false;
    }

    if (!language_backend) {
      toast.error("Selecciona una tecnologia backend.");
      return false;
    }

    if (
      (unitTime === "week" && time > 26) ||
      (unitTime === "month" && time > 6)
    ) {
      toast.error(
        "El projecte no pot tenir una durada superior a 6 mesos (26 setmanes).",
      );
      return false;
    }
    if (
      !title.trim() ||
      !description.trim() ||
      !programming_role.trim() ||
      numberDevsFront <= 0 ||
      numberDevsBack <= 0 ||
      !time ||
      !unitTime ||
      !limit_date_inscription
    ) {
      toast.error("Completa tots els camps obligatoris.");
      return false;
    }

    return true;
  };

  const getTimeDuration = (time: number, timeUnit: string): string => {
    switch (timeUnit) {
      case "week":
        return time > 1 ? `${time} setmanes` : `${time} setmana`;
      case "month":
        return time > 1 ? `${time} mesos` : `${time} mes`;
      default:
        return "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formPayload = {
      title: formData.title,
      language_frontend: formData.language_frontend,
      language_backend: formData.language_backend,
      description: formData.description,
      programming_role: formData.programming_role,
      numberDevsFront: formData.numberDevsFront,
      numberDevsBack: formData.numberDevsBack,
      time_duration: getTimeDuration(formData.time, formData.unitTime),
      limit_date_inscription: formData.limit_date_inscription,
    };

    try {
      await createCodeConnect(formPayload);
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
            const isSelected = formData.language_frontend.includes(item.label);

            return (
              <label
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-3 border-[#B91879] bg-white text-black"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                <input
                  type="radio"
                  name="language_frontend"
                  value={item.label}
                  checked={isSelected}
                  onChange={() =>
                    handleInputText("language_frontend", item.label)
                  }
                  className="sr-only"
                />
                {IconComponent ? <IconComponent className="w-5 h-5" /> : null}
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
            const isSelected = formData.language_backend.includes(item.label);

            return (
              <label
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-3 border-[#B91879] bg-white text-black"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                <input
                  type="radio"
                  name="language_backend"
                  value={item.label}
                  checked={isSelected}
                  onChange={() =>
                    handleInputText("language_backend", item.label)
                  }
                  className="sr-only"
                />
                {IconComponent ? <IconComponent className="w-5 h-5" /> : null}
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
          <label htmlFor="limit_date_inscription" className="block font-medium">
            Data límit d'inscripció *
          </label>
          <input
            id="limit_date_inscription"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg py-2 px-4"
            type="date"
            value={formData.limit_date_inscription || ""}
            required
            disabled={isSubmitting}
            onChange={(e) =>
              handleDeadLine("limit_date_inscription", e.target.value)
            }
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
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-t border-b border-l border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-tl-lg rounded-bl-lg py-2 px-4 w-16"
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
        <div className="grid gap-4 lg:grid-cols-3 items-center">
          <label htmlFor="programming_role" className="font-medium">
            Selecciona el teu rol tècnic *
          </label>
          <select
            id="programming_role"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-gray-100 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg h-10.5 px-4"
            value={formData.programming_role}
            required
            disabled={isSubmitting}
            onChange={(e) =>
              handleInputText("programming_role", e.target.value)
            }
          >
            <option value="" disabled>
              Selecciona
            </option>
            <option value="Backend Developer">Backend</option>
            <option value="Frontend Developer">Frontend</option>
            <option value="Fullstack Developer">Full stack</option>
          </select>
        </div>
      </div>

      <div className="lg:w-2/3 my-8">
        <div className="grid gap-4 items-center lg:grid-cols-3">
          <label htmlFor="devs-front" className="block font-medium col-span-2">
            Nombre de programadors frontend *
          </label>
          <input
            id="devs-front"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg py-2 px-4 w-full lg:w-16"
            type="number"
            value={
              formData.numberDevsFront === 0 ? "" : formData.numberDevsFront
            }
            placeholder="0"
            required
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
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#B91879] focus:border-[#B91879] rounded-lg py-2 px-4 w-full lg:w-16"
            type="number"
            value={formData.numberDevsBack === 0 ? "" : formData.numberDevsBack}
            placeholder="0"
            required
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
