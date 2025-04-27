import React from "react";
import { RxCross1 } from "react-icons/rx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-30 py-15 rounded-lg w-full max-w-3/5">
        <div className="flex relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-4 -top-4 cursor-pointer text-2xl text-gray-500"
          >
            <RxCross1 />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-gray-800 text-3xl text-center">
              Вы уверены, что хотите удалить проект?
            </h2>
            <p className="text-gray-600 text-center my-8">
              После удаления проекта, вы не сможете восстановить его
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-10 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Отменить
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-10 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
