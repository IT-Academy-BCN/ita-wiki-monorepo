import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { technicalTestSchema } from "../validations/technicalTestSchema";
import type { TechnicalTestFormData } from "../types/TechnicalTest";
import { createTechnicalTest } from "../api/endPointTechnicalTests";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useTechnicalTestForm = () => {
  const navigate = useNavigate();

  const form = useForm<TechnicalTestFormData>({
    resolver: zodResolver(technicalTestSchema),
    defaultValues: {
      title: "",
      description: "",
      language: undefined,
      duration: undefined,
      difficulty: undefined,
      tags: [],
      contentType: "text",
      file: [],
    },
  });

  const onSubmit = async (data: TechnicalTestFormData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("language", data.language);

    if (data.duration) {
      formData.append("duration", String(data.duration));
    }

    if (data.difficulty) {
      formData.append("difficulty_level", data.difficulty);
    }

    if (data.contentType === "text" && data.description) {
      formData.append("description", data.description);
    }

    if (data.contentType === "file" && data.file && data.file.length > 0) {
      const file = Array.isArray(data.file) ? data.file[0] : data.file[0];
      formData.append("file", file);
    }

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag.name);
      });
    }

    try {
      await createTechnicalTest(formData);
      toast.success("Technical test published successfully");
      navigate("/resources/technical-test/all-tech-tests");
    } catch {
      toast.error("Error publishing technical test");
    }
  };

  const handleCancel = () => {};

  return {
    form,
    onSubmit,
    handleCancel,
  };
};
