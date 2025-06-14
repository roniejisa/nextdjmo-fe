"use client";
import React, { useContext } from "react";
import { componentActions } from "./components";
import { CMSContext } from "@/context/cms/CMSProvider";

const ModuleActions = ({actions, module, item, moduleMain}) => {
  const { profile } = useContext(CMSContext);
  return (
    <div className="flex-1 py-1 px-2 gap-2 flex items-center">
      {actions.map((action, index) => {
        if (profile.permissions.includes(`${module}.${action.permission}`)) {
          const ComponentAction = componentActions[action.type];
          return (
            <ComponentAction
              item={item}
              data={moduleMain}
              module={module}
              action={action}
              key={index}
              href={`${module}/${item._id}`}
            >
              {action.svg}
            </ComponentAction>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ModuleActions;
