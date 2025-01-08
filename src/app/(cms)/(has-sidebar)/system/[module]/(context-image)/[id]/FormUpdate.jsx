"use client";
import Bool from "./components/Bool";
import Email from "./components/Email";
import ImageComponent from "./components/Image";
import Text from "./components/Text";
import Password from "./components/Password";
import GroupButtonForm from "../../components/form/GroupButtonForm";
import { handleUpdate } from "./actions";
import { useNotify } from "@/context/NotifyProvider";
import { useEffect, useState, useTransition } from "react";
import Editor from "./components/Editor";
import SelectParent from "./components/SelectParent";
import useRouterCustom from "@/packages/translation/Navigation";
import ImageListComponent from "./components/ImageList";
import SelectList from "./components/SelectList";
import Slug from "./components/Slug";
import Repeat from "./components/Repeat";
import DateComponent from "./components/Date";
import Textarea from "./components/Textarea";
import Link from "./components/Link";
import FieldType from "./components/FieldType";
import Key from "./components/Key";
import Tab from "./components/Tab";
import Group from "./components/Group";
import Permission from "./components/Permission";
import MultipleCheckbox from "./components/MultipleCheckbox";
import ProductVariant from "./components/ProductVariant";
import Language from "./components/Language";

const components = {
  text: Text,
  email: Email,
  image: ImageComponent,
  bool: Bool,
  password: Password,
  editor: Editor,
  select_parent: SelectParent,
  list_image: ImageListComponent,
  select_list: SelectList,
  slug: Slug,
  repeat: Repeat,
  date: DateComponent,
  textarea: Textarea,
  link: Link,
  field_type: FieldType,
  key: Key,
  tab: Tab,
  permission:Permission,
  multiple_checkbox:MultipleCheckbox,
  product_variants: ProductVariant,
  language: Language
};

const FormUpdate = ({ module, item, fields, moduleStore, searchParams }) => {
  const router = useRouterCustom();
  const notify = useNotify();
  const [isPending, startTransition] = useTransition(false);
  const [oldData, setOldData] = useState({
    ...item,
  });
  const isMultiple = moduleStore.language ?? false;
  const language = searchParams.language;
  const submitAction = async (form) => {
    startTransition(async () => {
      const formData = Object.fromEntries(form);
      const data = await handleUpdate(module, item._id, formData, language);
      if (data.status == 200) {
        router.push(process.env.NEXT_PUBLIC_ADMIN_URL + `${module}`);
        router.refresh(); // Làm mới dữ liệu sau khi chuyển route
        notify.changeNotify("success", data.message);
        return;
      } else {
        setOldData(formData);
        notify.changeNotify("error", data.message);
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
    <form action={submitAction}>
      <GroupButtonForm
        module={module}
        isPending={isPending}
        title={`Cập nhật ${moduleStore.name}`}
      />
      <div className="grid grid-cols-12 gap-4 px-4 py-4">
        <div className="col-span-9">
          {fieldLeft.map((field) => {
            const Component = components[field.type];
            return (
              <Group key={field.name} field={field}>
                <Component
                  defaultValue={oldData[field.name]}
                  oldData={oldData}
                  item={item}
                  module={module}
                  field={field}
                />
              </Group>
            );
          })}
          {fieldCustom.map((field) => {
            const Component = components[field.type];
            return (
              <Group key={field.name} field={field}>
                <Component
                  defaultValue={oldData[field.name]}
                  oldData={oldData}
                  item={item}
                  module={module}
                  field={field}
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
                  key={field.name}
                  defaultValue={oldData[field.name]}
                  oldData={oldData}
                  item={item}
                  module={module}
                  field={field}
                />
              </Group>
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default FormUpdate;
