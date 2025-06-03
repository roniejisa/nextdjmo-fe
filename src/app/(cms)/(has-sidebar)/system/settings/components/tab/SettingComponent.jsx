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

// Component mapping object
const FIELD_COMPONENTS = {
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

// Tab Navigation Component
const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <nav className="w-full lg:w-80 lg:sticky lg:top-16 lg:self-start lg:h-screen lg:max-h-[calc(100vh-4rem)]">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Cấu hình</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý thiết lập hệ thống</p>
      </div>
      
      <div className="p-2">
        <ul className="space-y-1">
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => onTabChange(tab.name)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  activeTab === tab.name
                    ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="flex-1">{tab.value}</span>
                {tab.items.length > 0 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.name
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    }`}
                  >
                    {tab.items.length}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
);

// Settings Item Component
const SettingsItem = ({ item, index }) => {
  const Component = FIELD_COMPONENTS[item.field_type];
  
  if (!Component) {
    console.warn(`Component not found for field type: ${item.field_type}`);
    return null;
  }

  const fieldProps = {
    label: item.name,
    name: item._id,
    placeholder: item.placeholder,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <Group field={fieldProps} item={item}>
        <Component
          field={fieldProps}
          item={item}
          defaultValue={item.data}
        />
      </Group>
    </div>
  );
};

// Tab Content Component
const TabContent = ({ tab, activeTab }) => {
  if (activeTab !== tab.name) return null;

  const sortedItems = tab.items
    .slice()
    .sort((a, b) => {
      const sortA = Number(a.sort) || 1;
      const sortB = Number(b.sort) || 1;
      return sortB - sortA;
    });

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{tab.value}</h1>
        <p className="text-gray-600">
          {tab.items.length > 0 
            ? `${tab.items.length} cấu hình có sẵn`
            : "Chưa có cấu hình nào được thiết lập"
          }
        </p>
      </div>

      {/* Settings Items */}
      {sortedItems.length > 0 ? (
        <div className="grid gap-6">
          {sortedItems.map((item, index) => (
            <SettingsItem key={item._id || index} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có cấu hình nào
          </h3>
          <p className="text-gray-500">
            Hiện tại chưa có cấu hình nào được thiết lập cho tab này.
          </p>
        </div>
      )}
    </div>
  );
};

// Main Settings Component
const SettingComponent = ({ data }) => {
  const [activeTab, setActiveTab] = useState(listTab[0]?.name);

  // Prepare tabs with filtered items
  const processedTabs = listTab.map((tab) => ({
    ...tab,
    items: data.items.filter((item) => item.tab === tab.name),
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab Navigation */}
          <TabNavigation
            tabs={processedTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {processedTabs.map((tab, index) => (
              <TabContent
                key={tab.name}
                tab={tab}
                activeTab={activeTab}
              />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingComponent;