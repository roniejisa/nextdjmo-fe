"use client";

import { useNotify } from "@/context/NotifyProvider";
import { formSubmitSetting } from "./action";

const FormSubmit = ({ children }) => {
  const notify = useNotify();
  const submitData = async (formData) => {
    const body = Object.fromEntries(formData);
    const response = await formSubmitSetting(body);
    if(response.status == 200) notify.changeNotify("success", response.message)
  };
  return <form action={submitData}>{children}</form>;
};

export default FormSubmit;
