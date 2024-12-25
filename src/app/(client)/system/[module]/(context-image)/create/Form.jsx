"use client";

import Bool from "./components/Bool";
import Email from "./components/Email";
import ImageComponent from "./components/Image";
import Text from "./components/Text";
import Password from "./components/Password";
import GroupButtonForm from "../../components/form/GroupButtonForm";
import { handleUpdate } from "./actions";
import { useNotify } from "@/context/NotifyProvider";
import { useState, useTransition } from "react";
import SelectParent from "./components/SelectParent";
import Editor from "./components/Editor";
import useRouterCustom from "@/packages/translation/Navigation";
import ImageListComponent from "./components/ImageList";
import SelectList from "./components/SelectList";
import Slug from "./components/Slug";
import Repeat from "./components/Repeat";
import DateComponent from "./components/Date";
import Textarea from "./components/Textarea";
import Tab from "./components/Tab";
import Key from "./components/Key";
import FieldType from "./components/FieldType";
import Link from "./components/Link";
import Group from "./components/Group";
import Phone from "./components/Phone";
import Permission from "./components/Permission";
import MultipleCheckbox from "./components/MultipleCheckbox";

const components = {
  text: Text,
  email: Email,
  image: ImageComponent,
  list_image: ImageListComponent,
  bool: Bool,
  password: Password,
  editor: Editor,
  select_parent: SelectParent,
  select_list: SelectList,
  slug: Slug,
  repeat: Repeat,
  date: DateComponent,
  textarea: Textarea,
  tab: Tab,
  key: Key,
  field_type: FieldType,
  link: Link,
  phone: Phone,
  permission: Permission,
  multiple_checkbox: MultipleCheckbox,
};

const FormCreate = ({ module, fields, moduleStore }) => {
  const notify = useNotify();
  const router = useRouterCustom();
  const [oldData, setOldData] = useState({});
  const [isPending, startTransition] = useTransition(false);
  const handleSubmit = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      const data = await handleUpdate(module, formData);
      if (data.status == 201) {
        router.push(process.env.NEXT_PUBLIC_ADMIN_URL + `${module}`);
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
    <form action={handleSubmit}>
      <GroupButtonForm
        module={module}
        isPending={isPending}
        title={`Tạo ${moduleStore.name}`}
      />
      <div className="grid grid-cols-12 gap-4 px-4 py-4">
        <div className="col-span-9">
          {fieldLeft.map((field) => {
            const Component = components[field.type];
            return (
              <Group key={field.name} field={field}>
                <Component
                  field={field}
                  defaultValue={oldData[field.name] || ""}
                  oldData={oldData}
                />
              </Group>
            );
          })}
          {fieldCustom.map((field) => {
            const Component = components[field.type];
            return (
              <Group key={field.name} field={field}>
                <Component
                  field={field}
                  defaultValue={oldData[field.name] || ""}
                  oldData={oldData}
                />
              </Group>
            );
          })}
        </div>
        <div className="col-span-3">
          {fieldRight.map((field) => {
            const Component = components[field.type];
            return (
              <Group key={field.name} field={field}>
                <Component
                  field={field}
                  defaultValue={oldData[field.name] || ""}
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
