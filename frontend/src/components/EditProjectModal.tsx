// Optimized

import React, { useState, useEffect, useCallback, memo } from "react";
import { RxCross1 } from "react-icons/rx";

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  curator: string;
  executor: string;
  creator: string;
  guest: string;
  deadline: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSave: (project: Project) => void;
}

const statusOptions = [
  { value: "Идея", label: "Идея" },
  { value: "Разработка", label: "Разработка" },
  { value: "Готово", label: "Готово" },
];

const EditProjectModal = memo(({ isOpen, onClose, project, onSave }: Props) => {
  const [formData, setFormData] = useState<Project>({
    id: 0,
    name: "",
    description: "",
    status: "",
    curator: "",
    executor: "",
    creator: "",
    guest: "",
    deadline: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        deadline: project.deadline
          ? project.deadline.replace(" ", "T").substring(0, 16)
          : "",
      });
    }
  }, [project]);

  const validate = useCallback(() => {
    const requiredFields: (keyof Project)[] = [
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
        newErrors[field] = "Обязательное поле";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      onSave({
        ...formData,
        deadline: formData.deadline.replace("T", " ") + ":00",
      });
      onClose();
    },
    [formData, validate, onSave, onClose]
  );

  const handleClose = useCallback(() => {
    setErrors({});
    onClose();
  }, [onClose]);

  const handleChange = useCallback(
    (field: keyof Project) =>
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

  // Helper function to render input fields
  const renderInputField = (
    field: keyof Project,
    label: string,
    type: string = "text",
    isTextarea: boolean = false
  ) => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
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
          value={formData[field]}
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
    <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <div className="flex relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute -right-4 -top-4 cursor-pointer text-2xl text-gray-500"
          >
            <RxCross1 />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-10 text-center">Редактирование</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInputField("name", "Название проекта")}
          {renderInputField("description", "Описание проекта", "text", true)}

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Статус</label>
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
          {renderInputField("guest", "Пригласить в проект")}

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
              Редактировать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default EditProjectModal;

// import React, { useState, useEffect } from "react";
// import { RxCross1 } from "react-icons/rx";
// import { formatForInput } from "../utils/dateFormat";

// interface Project {
//   id: number;
//   name: string;
//   description: string;
//   status: string;
//   curator: string;
//   executor: string;
//   creator: string;
//   guest: string;
//   deadline: string;
// }

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   project: Project;
//   onSave: (project: Project) => void;
// }

// const statusOptions = [
//   { value: "Идея", label: "Идея" },
//   { value: "Разработка", label: "Разработка" },
//   { value: "Готово", label: "Готово" },
// ];

// export default function EditProjectModal({
//   isOpen,
//   onClose,
//   project,
//   onSave,
// }: Props) {
//   const [formData, setFormData] = useState<Project>({
//     id: 0,
//     name: "",
//     description: "",
//     status: "",
//     curator: "",
//     executor: "",
//     creator: "",
//     guest: "",
//     deadline: "",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (project) {
//       setFormData({
//         ...project,
//         deadline: project.deadline
//           ? project.deadline.replace(" ", "T").substring(0, 16)
//           : "",
//       });
//     }
//   }, [project]);

//   const validate = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.name.trim()) newErrors.name = "Обязательное поле";
//     if (!formData.description.trim())
//       newErrors.description = "Обязательное поле";
//     if (!formData.status) newErrors.status = "Выберите статус";
//     if (!formData.deadline) newErrors.deadline = "Укажите дату окончания";
//     if (!formData.curator.trim()) newErrors.curator = "Укажите куратора";
//     if (!formData.executor.trim()) newErrors.executor = "Укажите исполнителя";
//     if (!formData.creator.trim()) newErrors.creator = "Укажите создателя";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     onSave({
//       ...formData,
//       deadline: formData.deadline.replace("T", " ") + ":00",
//     });
//     onClose();
//   };

//   const handleClose = () => {
//     setErrors({});
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-14 rounded-lg w-full max-w-2/5">
//         <div className="flex relative">
//           <button
//             type="button"
//             onClick={handleClose}
//             className="absolute -right-4 -top-4 cursor-pointer text-2xl text-gray-500"
//           >
//             <RxCross1 />
//           </button>
//         </div>
//         <h2 className="text-2xl font-bold mb-10 text-center">Редактирование</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Название проекта
//             </label>
//             <input
//               type="text"
//               className={`w-full p-2 rounded-md bg-gray-100 border ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Описание проекта
//             </label>
//             <textarea
//               className={`w-full p-2 rounded-md bg-gray-100 border ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//               rows={3}
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//             />
//             {errors.description && (
//               <p className="mt-1 text-sm text-red-600">{errors.description}</p>
//             )}
//           </div>
//           <div>
//             <select
//               className={`w-full p-2 rounded-md bg-gray-100 border ${
//                 errors.status ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.status}
//               onChange={(e) =>
//                 setFormData({ ...formData, status: e.target.value })
//               }
//             >
//               <option value="">Статус</option>
//               {statusOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.status && (
//               <p className="mt-1 text-sm text-red-600">{errors.status}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Дата окончания
//             </label>
//             <div className="relative">
//               <input
//                 type="datetime-local"
//                 className={`w-full p-2 rounded-md bg-gray-100 border ${
//                   errors.deadline ? "border-red-500" : "border-gray-300"
//                 } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//                 value={
//                   formData.deadline ? formatForInput(formData.deadline) : ""
//                 }
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value) {
//                     const formattedValue = value.replace("T", " ") + ":00";
//                     setFormData({ ...formData, deadline: formattedValue });
//                   } else {
//                     setFormData({ ...formData, deadline: "" });
//                   }
//                 }}
//                 onFocus={(e) => e.target.showPicker()}
//               />
//               {errors.deadline && (
//                 <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Куратор</label>
//             <input
//               type="text"
//               className={`w-full p-2 rounded-md bg-gray-100 border ${
//                 errors.curator ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.curator}
//               onChange={(e) =>
//                 setFormData({ ...formData, curator: e.target.value })
//               }
//             />
//             {errors.curator && (
//               <p className="mt-1 text-sm text-red-600">{errors.curator}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Исполнитель
//             </label>
//             <input
//               type="text"
//               className={`w-full p-2 rounded-md bg-gray-100 border ${
//                 errors.executor ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.executor}
//               onChange={(e) =>
//                 setFormData({ ...formData, executor: e.target.value })
//               }
//             />
//             {errors.executor && (
//               <p className="mt-1 text-sm text-red-600">{errors.executor}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Создатель
//             </label>
//             <input
//               type="text"
//               className={`w-full p-2 rounded-md bg-gray-100 border ${
//                 errors.creator ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.creator}
//               onChange={(e) =>
//                 setFormData({ ...formData, creator: e.target.value })
//               }
//             />
//             {errors.creator && (
//               <p className="mt-1 text-sm text-red-600">{errors.creator}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Пригласить в проект
//             </label>
//             <input
//               type="text"
//               className={`w-full p-2 rounded-md bg-gray-100 border ${
//                 errors.creator ? "border-red-500" : "border-gray-300"
//               } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.guest}
//               onChange={(e) =>
//                 setFormData({ ...formData, guest: e.target.value })
//               }
//             />
//             {errors.guest && (
//               <p className="mt-1 text-sm text-red-600">{errors.guest}</p>
//             )}
//           </div>
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-4 py-2 border border-sky-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
//             >
//               Отменить
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none"
//             >
//               Редактировать
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
