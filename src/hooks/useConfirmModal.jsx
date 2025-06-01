"use client";
import { AllContext } from "@/context/cms/AllProvider";
import { useNotify } from "@/context/NotifyProvider";
import { useCallback, useContext } from "react";

export const useConfirmModal = () => {
  const { setShowModalQuestion, setModalOptions } = useContext(AllContext);
  const notify = useNotify();
  const showConfirmModal = useCallback(
    ({ title, onConfirm, onCancel, successMessage, errorMessage }) => {
      setModalOptions({
        title,
        confirm: async () => {
          try {
            const result = await onConfirm?.();

            // Auto notify success
            if (successMessage) {
              notify.changeNotify("success", successMessage);
            } else if (typeof result === "string") {
              // Nếu onConfirm return message
              notify.changeNotify("success", result);
            }
          } catch (error) {
            console.error("Modal confirm error:", error);

            // Auto notify error
            const message = errorMessage || error.message || "Có lỗi xảy ra";
            notify.changeNotify("error", message);
          } finally {
            setShowModalQuestion(false);
          }
        },
        cancel: () => {
          onCancel?.();
          setShowModalQuestion(false);
        },
      });

      setShowModalQuestion(true);
    },
    [setShowModalQuestion, setModalOptions, notify]
  );

  return [showConfirmModal];
};
