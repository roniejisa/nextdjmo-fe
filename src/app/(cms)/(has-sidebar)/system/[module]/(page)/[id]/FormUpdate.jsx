"use client";
import GroupButtonForm from "../../fields/form/GroupButtonForm";
import { handleUpdate } from "./actions";
import { useNotify } from "@/context/NotifyProvider";
import { useContext, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import useRouterCustom from "@/packages/translation/Navigation";
import { components } from "../fields";
import Group from "../../fields/Group";
import { CMSContext } from "@/context/cms/CMSProvider";

const FormUpdate = ({ module, item, fields, moduleStore, searchParams }) => {
  const router = useRouterCustom();
  const notify = useNotify();
  const { profile } = useContext(CMSContext);
  const isMultipleLanguage = moduleStore.language ?? false;
  const language = searchParams.language;

  // Tạo bound action với các tham số cần thiết
  const boundAction = async (prevState, formData) => {
    const data = await handleUpdate(module, item._id, formData, language);

    if (data.status === 200) {
      router.refresh();
      notify.changeNotify("success", data.message);
      router.push(process.env.NEXT_PUBLIC_ADMIN_URL + `${module}`);
    } else {
      notify.changeNotify("error", data.message);
      // Nếu có lỗi, giữ lại dữ liệu form
      return {
        success: false,
        message: data.message,
        errors: data.errors || {},
      };
    }
  };

  // Sử dụng useFormState
  const [state, formAction, isPending] = useFormState(boundAction, {
    success: null,
    message: "",
    errors: {},
  });

  // Xử lý kết quả từ server action
  useEffect(() => {
    if (state) {
    }
  }, [state, router, notify, module]);

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
        title={`Cập nhật ${moduleStore.name}`}
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
                  value={item[field.name] ?? ""}
                  item={item}
                  module={module}
                  profile={profile}
                  isMultipleLanguage={isMultipleLanguage}
                  language={language}
                  field={field}
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
                  key={field.name}
                  value={item?.[field.name] ?? ""}
                  item={item}
                  isMultipleLanguage={isMultipleLanguage}
                  module={module}
                  profile={profile}
                  field={field}
                />
              </Group>
            );
          })}
        </div>
      </div>
      <div className="p-4">
        {fieldCustom.map((field) => {
          const Component = components[field.type];
          if (!Component) {
            return field.type + " không tồn tại";
          }
          return (
            <Group key={field.name} field={field}>
              <Component
                key={field.name}
                value={item?.[field.name] ?? ""}
                isMultipleLanguage={isMultipleLanguage}
                item={item}
                profile={profile}
                module={module}
                field={field}
              />
            </Group>
          );
        })}
      </div>
    </form>
  );
};

export default FormUpdate;
