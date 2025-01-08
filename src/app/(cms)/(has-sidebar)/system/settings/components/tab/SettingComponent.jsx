"use client";
import React, { useState } from "react";
import Text from "../Text";
import Email from "../Email";
import ImageComponent from "../Image";
import Bool from "../Bool";
import Password from "../Password";
import Editor from "../Editor";
import SelectParent from "../SelectParent";
import ImageListComponent from "../ImageList";
import SelectList from "../SelectList";
import Slug from "../Slug";
import Repeat from "../Repeat";
import DateComponent from "../Date";
import Textarea from "../Textarea";
import { listTab } from "@/app/(cms)/(has-sidebar)/constants/tab";
import Group from "../Group";

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
};
const SettingComponent = ({ data }) => {
  const [tabCurrent, setTabCurrent] = useState(listTab[0].name);

  const allTab = listTab.map((tab, index) => {
    return {
      ...tab,
      items: data.items.filter((item) => item.tab == tab.name),
    };
  });

  return (
    <div className="flex flex-wrap -mx-4">
      <ul className="flex flex-col flex-[0_0_20%] pl-4 sticky top-[68px] self-start h-[calc(100vh-68px-16px*2)] border-r">
        {allTab.map((item, index) => (
          <li
            key={index}
            className="border-b py-2 cursor-pointer"
            onClick={() => {
              setTabCurrent(item.name);
            }}
          >
            <span
              className={`transition hover:opacity-100 ${
                tabCurrent == item.name ? "font-bold text-outline opacity-100" : "opacity-50"
              }`}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex-1 px-4">
        {allTab.map((tab, index) => {
          return (
            <div
              key={index}
              className={`flex flex-col flex-wrap ${
                tabCurrent == tab.name ? "" : "hidden"
              }`}
            >
              {tab.items.length ? (
                tab.items
                  .sort((a, b) => {
                    b.sort = Number(b.sort) ?? 1;
                    a.sort = Number(a.sort) ?? 1;
                    return b.sort - a.sort;
                  })
                  .map((item, index) => {
                    const Component = components[item.field_type];
                    return (
                      <div
                        key={index}
                        className={`py-2 px-2`}
                      >
                        <Group
                          field={{
                            label: item.name,
                            name: item._id,
                            placeholder: item.placeholder,
                          }}
                          item={item}
                        >
                          <Component
                            field={{
                              label: item.name,
                              name: item._id,
                              placeholder: item.placeholder,
                            }}
                            item={item}
                            defaultValue={item.data}
                          />
                        </Group>
                      </div>
                    );
                  })
              ) : (
                <div className="py-4 px-4">Chưa có cấu hình nào</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingComponent;
