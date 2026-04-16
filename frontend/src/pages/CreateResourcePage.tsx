import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { createResource } from "../api/endPointResources";
import arrowLeft from "../assets/arrow-left.svg";
import ButtonComponent from "../components/atoms/ButtonComponent";
import TagInput from "../components/forms/TagInput";
import FormInput from "../components/resources/create-resources/FormInput";
import { contentResourcesForm } from "../components/resources/create-resources/languagesLabelsContent";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import { useResources } from "../context/ResourcesContext";
import { useUserContext } from "../context/UserContext";
import { Category, IntResource, Tag } from "../types";
import { resourceSchema } from "../validations/resourceSchema";

export default function CreateResourcePage() {
  const navigate = useNavigate();
  const { refreshResources } = useResources();
  const { user } = useUserContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<Partial<IntResource>>({
    resolver: zodResolver(resourceSchema),
  });

  const titleValue = useWatch({
    control,
    name: "title",
    defaultValue: "",
  });

  const descriptionValue = useWatch({
    control,
    name: "description",
    defaultValue: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedTags, setselectedTags] = useState<Tag[]>([]);

  const handleTagChange = useCallback(
    (tags: Tag[]) => {
      setselectedTags(tags);
      setValue("tags", tags);
    },
    [setValue],
  );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setValue("category", category);
  };

  const onSubmit = async (data: Partial<IntResource>) => {
    if (!user) return;
    const tagsWithIds =
      Array.isArray(data.tags) && data.tags.length
        ? data.tags.map((tag) =>
            typeof tag === "string" ? tag : String(tag.id),
          )
        : [];

    const newResource = {
      title: data.title,
      description: data.description,
      url: data.url,
      category: data.category,
      tags: tagsWithIds,
      type: data.type,
      github_id: user.github_id,
    };

    try {
      await createResource(newResource);
      toast.success("¡Recurso creado con éxito!");
      await refreshResources();
      navigate(`/resources/${data?.category}`);
      reset();
    } catch (error) {
      console.error("Error al crear el recurso:", error);
      toast.error("Hubo un error al crear el recurso");
    }
  };

  const charLimitTitle = 65;
  const charLimitDescription = 120;

  const goBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/resources/React");
    }
  };

  return (
    <>
      <PageTitle title="Crear recurs" />
      <Container>
        <div className="md:flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <button
              onClick={goBack}
              className="text-md font-medium text-primary flex items-center gap-2 cursor-pointer hover:opacity-80"
            >
              <img className="w-4 h-4" src={arrowLeft} alt="Arrow Left" />
              <span>Tornar enrere</span>
            </button>
            <h1 className="text-[26px] font-black ">Nou recurs</h1>
          </div>
          <div className="flex">
            <ButtonComponent
              variant="secondary"
              onClick={() => window.history.back()}
              className="min-w-[8rem] max-h-[2.75rem] mr-4"
            >
              Cancel·lar
            </ButtonComponent>
            <ButtonComponent
              type="button"
              variant="primary"
              className="min-w-[8rem] max-h-[2.75rem]"
              onClick={handleSubmit(onSubmit)}
            >
              Publicar
            </ButtonComponent>
          </div>
        </div>
        <hr className="w-full border-t border-gray-300 mt-3" />

        <div className="flex mt-6 overflow-y-scroll">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
            <div className="flex-col gap-5 my-5">
              <FormInput
                id="title"
                label="Títol"
                placeholder=""
                limitedText={true}
                register={register}
                textLength={titleValue?.length}
                errors={errors.title?.message}
                className="max-h-[2.6rem]"
                maxLength={charLimitTitle}
                onChange={(e) => {
                  setValue("title", e.target.value);
                }}
              />

              <FormInput
                id="url"
                label="URL"
                placeholder=""
                register={register}
                errors={errors.url?.message}
                className="max-h-[2.6rem]"
                onChange={(e) => {
                  setValue("url", e.target.value);
                }}
              />
            </div>

            <h2 className="text-sm text-black font-medium mb-3">Llenguatge</h2>
            <div className="flex flex-wrap gap-3">
              {contentResourcesForm.map((cat) => {
                const IconComponent = cat.icon;

                return (
                  <ButtonComponent
                    type="button"
                    variant="secondary"
                    onClick={() => handleCategorySelect(cat.label)}
                    className={`!w-fit text-black  ${
                      selectedCategory === cat.label
                        ? "border-2 focus:border-[#B91879]"
                        : ""
                    }`}
                    key={cat.label}
                  >
                    <div className="flex justify-center items-center gap-1 h-fit">
                      <IconComponent className="w-5 h-5" />
                      <h1 className="text-sm font-medium">{cat.label}</h1>
                    </div>
                  </ButtonComponent>
                );
              })}
            </div>
            <div className="h-6">
              {errors.category && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.category.message}
                </p>
              )}
            </div>

            <h2 className="text-sm text-black font-medium mb-4">
              Tipus de recurs
            </h2>
            <div className="flex justify-start gap-x-10 mb-1">
              <div className="ml-1 flex gap-2 md:text-xl">
                <input
                  type="radio"
                  id="video"
                  value="Video"
                  className=" scale-150 accent-[#B91879] "
                  {...register("type", { required: true })}
                />
                <label htmlFor="video" className="text-sm">
                  Vídeo
                </label>
              </div>
              <div className="flex gap-2 md:text-xl">
                <input
                  type="radio"
                  id="curso"
                  value="Cursos"
                  className="scale-150 accent-[#B91879]"
                  {...register("type", { required: true })}
                />
                <label htmlFor="curso" className="text-sm">
                  Curso
                </label>
              </div>
              <div className="flex gap-2 md:text-xl">
                <input
                  type="radio"
                  id="blog"
                  value="Blog"
                  className="scale-150 accent-[#B91879]"
                  {...register("type", { required: true })}
                />
                <label htmlFor="blog" className="text-sm">
                  Blog
                </label>
              </div>
            </div>
            <div className="h-6">
              {errors.type && (
                <p className="text-red-500 text-xs">{errors.type.message}</p>
              )}
            </div>

            <TagInput
              selectedTags={selectedTags}
              setselectedTags={handleTagChange}
              selectedCategory={selectedCategory}
            />
            <div className="h-6">
              {errors.tags && (
                <p className="text-red-500 text-xs">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <hr className="w-full border-t border-gray-300 mt-3" />

              <h2 className="text-base font-semibold mt-6 mb-6">
                Informació addicional
              </h2>
              <FormInput
                id="description"
                label="Descripció"
                placeholder=""
                register={register}
                limitedText={true}
                textLength={descriptionValue?.length}
                errors={errors.description?.message}
                className="max-h-[4.5rem]"
                maxLength={charLimitDescription}
                onChange={(e) => {
                  setValue("description", e.target.value);
                }}
              />
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}
