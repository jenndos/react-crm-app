// Optimized

import React, { useState, useCallback } from "react";
import { RxCross1 } from "react-icons/rx";
import { formatForInput } from "../utils/dateFormat";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at?: string;
  deadline: string;
  creator: string;
  curator: string;
  executor: string;
  participants?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Omit<Task, "id">) => void;
}

const statusOptions = [
  { value: "Черновик", label: "Черновик" },
  { value: "В очереди", label: "В очереди" },
  { value: "В процессе", label: "В процессе" },
  { value: "Тестирование", label: "Тестирование" },
  { value: "Завершено", label: "Завершено" },
];

const initialFormState = {
  title: "",
  description: "",
  status: "",
  deadline: "",
  creator: "",
  curator: "",
  executor: "",
  participants: "",
};

export default function CreateTaskModal({ isOpen, onClose, onCreate }: Props) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const requiredFields = [
      "title",
      "description",
      "status",
      "deadline",
      "creator",
      "curator",
      "executor",
    ];
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        newErrors[field] = "Обязательное поле";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleDateTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        deadline: value ? value.replace("T", " ") + ":00" : "",
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      onCreate({
        ...formData,
        participants: formData.participants || "",
      });

      onClose();
      setFormData(initialFormState);
    },
    [formData, onCreate, onClose, validate]
  );

  const handleClose = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const renderInputField = (
    name: keyof typeof formData,
    label: string,
    type = "text",
    isTextArea = false,
    customOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const InputComponent = isTextArea ? "textarea" : "input";
    const value = formData[name];
    const error = errors[name];

    return (
      <div>
        <label className="block text-sm font-normal text-gray-500 mb-1">
          {label}
        </label>
        <InputComponent
          name={name}
          type={type}
          className={`w-full p-2 rounded-md bg-gray-100 border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          value={
            type === "datetime-local" && name === "deadline"
              ? value
                ? formatForInput(value)
                : new Date().toISOString().slice(0, 16)
              : value
          }
          onChange={customOnChange || handleInputChange}
          rows={isTextArea ? 3 : undefined}
          onFocus={
            type === "datetime-local"
              ? (e: React.FocusEvent<HTMLInputElement>) => e.target.showPicker()
              : undefined
          }
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Создание задачи</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <RxCross1 size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInputField("title", "Название задачи")}
          {renderInputField("description", "Описание", "text", true)}

          {/* Status */}
          <div>
            <label className="block text-sm font-normal text-gray-500 mb-1">
              Статус
            </label>
            <select
              name="status"
              className={`w-full p-2 rounded-md bg-gray-100 border ${
                errors.status ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="">Выберите статус</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          {renderInputField(
            "deadline",
            "Дата окончания",
            "datetime-local",
            false,
            handleDateTimeChange
          )}
          {renderInputField("creator", "Создатель")}
          {renderInputField("curator", "Куратор")}
          {renderInputField("executor", "Исполнитель")}
          {renderInputField("participants", "Участники")}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-sky-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none"
            >
              Создать задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
