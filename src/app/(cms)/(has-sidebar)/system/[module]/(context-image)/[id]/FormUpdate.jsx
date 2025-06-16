"use client";
import GroupButtonForm from "../../components/form/GroupButtonForm";
import { handleUpdate } from "./actions";
import { useNotify } from "@/context/NotifyProvider";
import { useContext, useEffect, useState, useTransition } from "react";
import useRouterCustom from "@/packages/translation/Navigation";
import { components } from "./components";
import Group from "../../components/Group";
import { CMSContext } from "@/context/cms/CMSProvider";

const FormUpdate = ({ module, item, fields, moduleStore, searchParams }) => {
  const router = useRouterCustom();
  const notify = useNotify();
  const { profile } = useContext(CMSContext);
  const [isPending, startTransition] = useTransition(false);
  const [oldData, setOldData] = useState({
    ...item,
  });

  const isMultipleLanguage = moduleStore.language ?? false;
  const language = searchParams.language;
  const submitAction = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      const data = await handleUpdate(module, item._id, formData, language);
      if (data.status == 200) {
        router.refresh();
        notify.changeNotify("success", data.message);
        router.push(process.env.NEXT_PUBLIC_ADMIN_URL + `${module}`);
      } else {
        notify.changeNotify("error", data.message);
        setOldData(formData);
      }
    });
  };

  useEffect(() => {
    setOldData(item);
  }, [item]);

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
    <form action={submitAction} className="pb-10">
      <GroupButtonForm
        module={module}
        isPending={isPending}
        title={`Cập nhật ${moduleStore.name}`}
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
                  defaultValue={oldData?.[field.name]}
                  oldData={oldData}
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
                  defaultValue={oldData?.[field.name]}
                  oldData={oldData}
                  item={item}
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
                defaultValue={oldData?.[field.name] ?? ""}
                oldData={oldData}
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
