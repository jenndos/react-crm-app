import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import DeleteTaskModal from "../components/DeleteTaskModal";
import axios from "axios";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import { MdEdit, MdDelete } from "react-icons/md";
import { formatDateTime } from "../utils/dateFormat";
import EditTaskModal from "../components/EditTaskModal";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  deadline: string;
  creator: string;
  curator: string;
  executor: string;
}

export default function TaskCardPage() {
  const { taskId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusBgColors: Record<Task["status"], string> = {
    Черновик: "bg-teal-200",
    "В очереди": "bg-blue-200",
    "В процессе": "bg-orange-200",
    Тестирование: "bg-purple-200",
    Завершено: "bg-green-200",
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tasks/${taskId}`
        );
        setTask(response.data.task);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdate = async (updatedTask: Task) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updatedTask
      );
      setTask(response.data.task);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center mr-2 hover:bg-gray-200 rounded-full h-12 w-12"
          >
            <span className="text-4xl leading-none">
              <LiaLongArrowAltLeftSolid />
            </span>
          </button>
          <h1 className="text-3xl">Карточка задачи</h1>
        </div>
        <p className="text-2xl">
          {task.id} — {task.title}
        </p>
      </div>

      {/* Card content */}
      <div className="bg-white rounded-lg">
        {/* Card header */}
        <div className="flex items-center h-20">
          {/* Name and Status block */}
          <div className="flex-1 pl-6 flex items-center pr-4 border-gray-300 h-full">
            <h2 className="text-2xl truncate max-w-[300px]">{task.title}</h2>
            <span
              className={`ml-20 inline-block px-3 py-2 rounded-md text-sm ${
                statusBgColors[task.status]
              }`}
            >
              {task.status}
            </span>
          </div>

          {/* Dates block */}
          <div className="flex justify-between items-center px-6">
            <p className="text-gray-600">
              {formatDateTime(task.created_at)
                .split(" ")
                .map((part, index) => (
                  <span key={index} className={index === 0 ? "mr-6" : ""}>
                    {part}
                  </span>
                ))}
            </p>
            <span className="mx-6 text-gray-500 font-bold">⸺</span>
            <p className="text-gray-600">
              {formatDateTime(task.deadline)
                .split(" ")
                .map((part, index) => (
                  <span key={index} className={index === 0 ? "mr-6" : ""}>
                    {part}
                  </span>
                ))}
            </p>
          </div>

          <div className="w-px h-full bg-gray-300"></div>

          {/* Icons block */}
          <div className="flex justify-end px-5">
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xl text-gray-500 p-2 rounded hover:bg-gray-100"
              >
                <MdEdit />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-xl text-gray-500 p-2 rounded hover:bg-gray-100"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        </div>

        <hr className="text-gray-300" />

        {/* Card details - restructured */}

        <div className="grid grid-cols-[20%_80%] p-6 relative">
          {/* Vertical border */}
          <div className="absolute left-[20%] inset-y-0 w-px bg-gray-300" />

          {/* Rows */}
          {[
            { label: "Описание", value: task.description, type: "text" },
            { label: "Кто создал задачу", value: task.creator, type: "avatar" },
            {
              label: "Куратор",
              value: task.curator,
              type: "avatars",
              count: 2,
            },
            {
              label: "Исполнитель",
              value: task.executor,
              type: "avatars",
              count: 3,
            },
          ].map((item, index) => (
            <React.Fragment key={item.label}>
              {/* Label */}
              <div className="pb-6">
                <div className="pr-4 text-gray-700 h-full flex items-center">
                  {item.label}
                </div>
              </div>

              {/* Value */}
              <div className="pb-6 pl-4">
                {item.type === "text" ? (
                  <div>{item.value}</div>
                ) : (
                  <div className="flex items-center gap-3">
                    {item.type === "avatar" ? (
                      <div className="w-10 h-10 bg-gray-300 rounded-full border border-gray-400" />
                    ) : (
                      <div className="flex -space-x-2">
                        {Array.from({ length: item.count || 2 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 bg-gray-300 rounded-full border border-gray-400"
                          />
                        ))}
                      </div>
                    )}
                    <p>{item.value}</p>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
          onSave={handleUpdate}
        />

        <DeleteTaskModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
