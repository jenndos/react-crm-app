import React, { useState, useCallback, memo } from "react";
import { RxCross1 } from "react-icons/rx";
import { formatForInput } from "../utils/dateFormat";

interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  deadline: string;
  curator: string;
  executor: string;
  creator: string;
  guest: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: ProjectFormData) => void;
}

const statusOptions = [
  { value: "Идея", label: "Идея" },
  { value: "Разработка", label: "Разработка" },
  { value: "Готово", label: "Готово" },
];

const initialFormData: ProjectFormData = {
  name: "",
  description: "",
  status: "",
  deadline: "",
  curator: "",
  executor: "",
  creator: "",
  guest: "",
};

const CreateProjectModal = memo(({ isOpen, onClose, onCreate }: Props) => {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const requiredFields: (keyof ProjectFormData)[] = [
      "name",
      "description",
      "status",
      "deadline",
      "curator",
      "executor",
      "creator",
    ];

    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] =
          field === "status"
            ? "Выберите статус"
            : field === "deadline"
            ? "Укажите дату окончания проекта"
            : `Обязательное поле`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      onCreate({
        ...formData,
        deadline: formData.deadline.replace("T", " ") + ":00",
      });
      setFormData(initialFormData);
      onClose();
    },
    [formData, validate, onCreate, onClose]
  );

  const handleClose = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  }, [onClose]);

  const handleChange = useCallback(
    (field: keyof ProjectFormData) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      },
    []
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        deadline: value ? value.replace("T", " ") + ":00" : "",
      }));
    },
    []
  );

  if (!isOpen) return null;

  const renderInputField = (
    field: keyof ProjectFormData,
    label: string,
    type: string = "text",
    isTextarea: boolean = false
  ) => (
    <div>
      <label className="block text-sm font-normal text-gray-500 mb-1">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          className={`w-full p-2 rounded-md bg-gray-100 border ${
            errors[field] ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          rows={3}
          value={formData[field]}
          onChange={handleChange(field)}
        />
      ) : (
        <input
          type={type}
          className={`w-full p-2 rounded-md bg-gray-100 border ${
            errors[field] ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          value={
            type === "datetime-local"
              ? formData[field]
                ? formatForInput(formData[field])
                // Current date time
                : new Date().toISOString().slice(0, 16)
              : formData[field]
          }
          onChange={
            type === "datetime-local" ? handleDateChange : handleChange(field)
          }
          onFocus={
            type === "datetime-local"
              ? (e: React.FocusEvent<HTMLInputElement>) => e.target.showPicker()
              : undefined
          }
        />
      )}
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-51">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Создание проекта</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <RxCross1 size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInputField("name", "Название проекта")}
          {renderInputField("description", "Описание", "text", true)}

          {/* Status */}
          <div>
            <label className="block text-sm font-normal text-gray-500 mb-1">
              Статус
            </label>
            <select
              className={`w-full p-2 rounded-md bg-gray-100 border ${
                errors.status ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              value={formData.status}
              onChange={handleChange("status")}
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

          {renderInputField("deadline", "Дата окончания", "datetime-local")}
          {renderInputField("curator", "Куратор")}
          {renderInputField("executor", "Исполнитель")}
          {renderInputField("creator", "Создатель")}

          <div>
            <label className="block text-sm font-normal text-gray-500 mb-1">
              Пригласить в проект
            </label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={formData.guest}
              onChange={handleChange("guest")}
            />
          </div>

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
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none"
            >
              Создать проект
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CreateProjectModal;
