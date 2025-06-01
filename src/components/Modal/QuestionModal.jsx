"use client";

import { AllContext } from "@/context/cms/AllProvider";
import { useContext, useRef, useEffect, forwardRef } from "react";
import CloseIcon from "../Icon/svg/Close";

const QuestionModal = () => {
  const { showModalQuestion, setShowModalQuestion, modalOptions } =
    useContext(AllContext);
  const modalRef = useRef(null);

  // Logic handlers
  const handleSubmit = async (form) => {
    modalOptions?.confirm?.(form);
  };

  const handleClose = (e) => {
    if (e.target === modalRef.current) {
      setShowModalQuestion(false);
    }
  };

  const handleCloseButton = () => {
    setShowModalQuestion(false);
  };

  // Keyboard event handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModalQuestion) {
        setShowModalQuestion(false);
      }
    };

    if (showModalQuestion) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModalQuestion, setShowModalQuestion]);

  if (!showModalQuestion) {
    return null;
  }

  return (
    <ModalOverlay 
      ref={modalRef}
      onClick={handleClose}
      isVisible={showModalQuestion}
    >
      <ModalDialog isVisible={showModalQuestion}>
        <ModalHeader 
          title={modalOptions?.title}
          onClose={handleCloseButton}
        />
        
        <ModalForm
          onSubmit={handleSubmit}
          component={modalOptions?.component}
          btnCancel={modalOptions?.btnCancel}
          btnAccept={modalOptions?.btnAccept}
          onCancel={handleCloseButton}
        />
      </ModalDialog>
    </ModalOverlay>
  );
};

// Modal Overlay Component - Sử dụng forwardRef
const ModalOverlay = forwardRef(({ children, onClick, isVisible, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      onClick={onClick}
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/20 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
    >
      {children}
    </div>
  );
});

// Thêm displayName để dễ debug
ModalOverlay.displayName = 'ModalOverlay';

// Modal Dialog Component  
const ModalDialog = ({ children, isVisible }) => {
  return (
    <div
      className={`
        relative w-full max-w-md mx-4
        bg-white rounded-xl shadow-2xl
        transform transition-all duration-300 ease-out
        ${isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-4'
        }
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

// Modal Header Component
const ModalHeader = ({ title, onClose }) => {
  return (
    <div className="flex items-start justify-between p-6 pb-4">
      <div className="flex-1 pr-4">
        {title && (
          <h2 className="text-xl font-semibold text-gray-900 leading-6">
            {title}
          </h2>
        )}
      </div>
      
      <CloseButton onClick={onClose} />
    </div>
  );
};

// Close Button Component
const CloseButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-shrink-0 p-2 rounded-full
        text-gray-400 hover:text-gray-600 hover:bg-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition-all duration-200
        group
      `}
      aria-label="Đóng modal"
    >
      <CloseIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
    </button>
  );
};

// Modal Form Component
const ModalForm = ({ 
  onSubmit, 
  component, 
  btnCancel, 
  btnAccept, 
  onCancel 
}) => {
  return (
    <form action={onSubmit} className="px-6 pb-6">
      {/* Modal Content */}
      {component && (
        <div className="mb-6">
          {component}
        </div>
      )}

      {/* Action Buttons */}
      <ModalActions
        btnCancel={btnCancel}
        btnAccept={btnAccept}
        onCancel={onCancel}
      />
    </form>
  );
};

// Modal Actions Component
const ModalActions = ({ btnCancel, btnAccept, onCancel }) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <CancelButton onClick={onCancel}>
        {btnCancel || "Hủy"}
      </CancelButton>
      
      <ConfirmButton>
        {btnAccept || "Đồng ý"}
      </ConfirmButton>
    </div>
  );
};

// Cancel Button Component
const CancelButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-lg
        text-sm font-medium text-gray-700
        bg-white border border-gray-300
        hover:bg-gray-50 hover:text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all duration-200
      `}
    >
      {children}
    </button>
  );
};

// Confirm Button Component  
const ConfirmButton = ({ children }) => {
  return (
    <button
      type="submit"
      className={`
        px-4 py-2.5 rounded-lg
        text-sm font-medium text-white
        bg-blue-600 border border-blue-600
        hover:bg-blue-700 hover:border-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        active:bg-blue-800
        transition-all duration-200
        shadow-sm hover:shadow-md
      `}
    >
      {children}
    </button>
  );
};

export default QuestionModal;