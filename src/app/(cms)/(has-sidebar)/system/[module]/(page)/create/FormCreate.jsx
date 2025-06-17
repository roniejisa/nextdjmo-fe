"use client";

import GroupButtonForm from "../../fields/form/GroupButtonForm";
import { handleCreate } from "./actions";
import { useNotify } from "@/context/NotifyProvider";
import { useFormState } from "react-dom";
import useRouterCustom from "@/packages/translation/Navigation";
import { components } from "../fields";
import Group from "../../fields/Group";
import { useState } from "react";

const FormCreate = ({ module, fields, moduleStore, searchParams }) => {
  const [isPending, setIsPending] = useState(false);
  const notify = useNotify();
  const router = useRouterCustom();
  const isStoreLanguage = moduleStore.language ?? false;
  const language = searchParams.language;

  // Tạo action wrapper để handle redirect và notification
  const handleSubmitAction = async (prevState, formData) => {
    setIsPending(true);
    const data = await handleCreate(module, formData, language);
    setIsPending(false);
    if (data.status == 201) {
      if (isStoreLanguage) {
        router.pushWithQuery(
          process.env.NEXT_PUBLIC_ADMIN_URL + module + "/" + data?.data?._id,
          { language: language }
        );
      } else {
        router.push(process.env.NEXT_PUBLIC_ADMIN_URL + `${module}`);
      }
      await notify.changeNotify("success", data.message);
      return { success: true, message: data.message };
    } else {
      await notify.changeNotify("error", data.message);
      return {
        success: false,
        message: data.message,
        errors: data.errors || {},
      };
    }
  };

  const [state, formAction] = useFormState(handleSubmitAction, {
    success: null,
    message: "",
    errors: {},
  });
  const fieldLeft = fields
    .filter((field) => {
      field.position = field.position ?? "left";
      return field.position === "left";
    })
    .sort((a, b) => {
      b.sort = b.sort ?? 999999;
      return a.sort - b.sort;
    });

  const fieldRight = fields
    .filter((field) => {
      field.position = field.position ?? "right";
      return field.position === "right";
    })
    .sort((a, b) => {
      b.sort = b.sort ?? 999999;
      return a.sort - b.sort;
    });

  const fieldCustom = fields
    .filter((field) => {
      field.position = field.position ?? "custom";
      return field.position === "custom";
    })
    .sort((a, b) => {
      b.sort = b.sort ?? 999999;
      return a.sort - b.sort;
    });
  return (
    <form action={formAction} className="pb-10">
      <GroupButtonForm
        module={module}
        isPending={isPending}
        title={`Tạo ${moduleStore.name}`}
      />

      <div className="grid grid-cols-12 gap-4 px-4 py-4">
        <div className="col-span-9">
          {fieldLeft.map((field) => {
            const Component = components[field.type];
            if (!Component) {
              return field.type + " không tồn tại";
            }
            return (
              <Group key={field.name} field={field}>
                <Component
                  field={field}
                  module={module}
                  language={language}
                  isMultipleLanguage={isStoreLanguage}
                  error={state?.errors?.[field.name]}
                />
              </Group>
            );
          })}
          {fieldCustom.map((field) => {
            const Component = components[field.type];
            if (!Component) {
              return field.type + " không tồn tại";
            }
            return (
              <Group key={field.name} field={field}>
                <Component
                  field={field}
                  module={module}
                  language={language}
                  isMultipleLanguage={isStoreLanguage}
                  error={state?.errors?.[field.name]}
                />
              </Group>
            );
          })}
        </div>
        <div className="col-span-3">
          {fieldRight.map((field) => {
            const Component = components[field.type];
            if (!Component) {
              return field.type + " không tồn tại";
            }
            return (
              <Group key={field.name} field={field}>
                <Component
                  field={field}
                  module={module}
                  language={language}
                  isMultipleLanguage={isStoreLanguage}
                  error={state?.errors?.[field.name]}
                />
              </Group>
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default FormCreate;
