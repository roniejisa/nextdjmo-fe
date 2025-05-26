"use client";

import GroupButtonForm from "../../components/form/GroupButtonForm";
import { handleCreate } from "./actions";
import { useNotify } from "@/context/NotifyProvider";
import { useState, useTransition } from "react";
import useRouterCustom from "@/packages/translation/Navigation";
import { components } from "./components";
import Group from "../../components/Group";

const FormCreate = ({ module, fields, moduleStore, searchParams }) => {
  const notify = useNotify();
  const router = useRouterCustom();
  const [oldData, setOldData] = useState({});
  const [isPending, startTransition] = useTransition(false);
  const isMultiple = moduleStore.language ?? false;
  const language = searchParams.language;

  const handleSubmit = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      const data = await handleCreate(module, formData, language);
      if (data.status == 201) {
        if (isMultiple)
          router.push(
            process.env.NEXT_PUBLIC_ADMIN_URL +
              `${data.data._id}?language=${language}`
          );
        router.push(process.env.NEXT_PUBLIC_ADMIN_URL + `${module}`);
        router.refresh();
        await notify.changeNotify("success", data.message);
        return;
      } else {
        setOldData(formData);
        await notify.changeNotify("error", data.message);
      }
    });
  };

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
    <form action={handleSubmit} className="pb-10">
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
                  defaultValue={oldData?.[field.name] ?? ""}
                  module={module}
                  oldData={oldData}
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
                  defaultValue={oldData?.[field.name] ?? ""}
                  module={module}
                  oldData={oldData}
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
                  defaultValue={oldData?.[field.name] ?? ""}
                  module={module}
                  oldData={oldData}
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
