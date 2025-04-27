import React, { useEffect, useState, useCallback } from "react";
import { BiSolidGridAlt } from "react-icons/bi";
import { TfiMenuAlt } from "react-icons/tfi";
import { AiOutlinePlus } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { IoIosBriefcase } from "react-icons/io";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";
import KanbanBoard from "../components/KanbanBoard";
import TasksTable from "../components/TasksTable";

export interface Task {
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

const TasksPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");

  const [kanbanIsActive, setKanbanActive] = useState(
    searchParams.get("view") !== "list"
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isKanbanScrolledToEnd, setIsKanbanScrolledToEnd] = useState(false);

  const setKanbanView = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", "kanban");
    navigate(`?${newParams.toString()}`, { replace: true });
    setKanbanActive(true);
  }, [navigate, searchParams]);

  const setListView = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", "list");
    navigate(`?${newParams.toString()}`, { replace: true });
    setKanbanActive(false);
  }, [navigate, searchParams]);

  useEffect(() => {
    if (!userId) {
      setError("User ID is required");
      setIsLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tasks?user_id=${userId}`
        );
        setTasks(response.data.tasks);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const moveTask = useCallback(
    async (id: number, newStatus: string) => {
      try {
        const taskToUpdate = tasks.find((task) => task.id === id);
        if (!taskToUpdate) return;

        const response = await axios.put(
          `http://localhost:5000/api/tasks/${id}`,
          {
            ...taskToUpdate,
            status: newStatus,
          }
        );

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      } catch (err) {
        console.error("Failed to update task status:", err);
        throw err;
      }
    },
    [tasks]
  );

  const handleCreate = useCallback(
    async (taskData: {
      title: string;
      description: string;
      status: string;
      deadline: string;
      creator: string;
      curator: string;
      executor: string;
      participants?: string;
    }) => {
      try {
        const response = await axios.post("http://localhost:5000/api/tasks", {
          ...taskData,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
        setTasks((prev) => [...prev, response.data.task]);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
    },
    [userId]
  );

  const handleUpdate = useCallback(async (updatedTask: Task) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${updatedTask.id}`,
        updatedTask
      );
      setTasks((prev) =>
        prev.map((p) => (p.id === updatedTask.id ? response.data.task : p))
      );
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedTask) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${selectedTask.id}`);
      setTasks((prev) => prev.filter((p) => p.id !== selectedTask.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [selectedTask]);

  const navigateToTask = useCallback(
    (taskId: number) => {
      const currentView = kanbanIsActive ? "kanban" : "list";
      navigate(`/tasks/${taskId}?user_id=${userId}&view=${currentView}`);
    },
    [navigate, userId, kanbanIsActive]
  );

  const openEditModal = useCallback((task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className={`pl-8 pt-8 pb-8 h-full flex flex-col ${
        (kanbanIsActive && isKanbanScrolledToEnd) || !kanbanIsActive
          ? "pr-8"
          : ""
      }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between mt-4 mb-12 ${
          kanbanIsActive ? "pr-8" : ""
        }`}
      >
        <div className="flex-2 flex items-center justify-between">
          <h1 className="text-3xl">Задачи</h1>

          <div className="flex justify-center items-center w-8 h-8 bg-white border border-gray-400 rounded-full cursor-pointer">
            <span className="text-2xl text-gray-400">?</span>
          </div>

          <div className="flex text-3xl gap-2">
            <button
              onClick={setKanbanView}
              className={`cursor-pointer ${
                kanbanIsActive ? "text-black" : "text-gray-400"
              }`}
            >
              <BiSolidGridAlt />
            </button>
            <button
              onClick={setListView}
              className={`cursor-pointer ${
                kanbanIsActive ? "text-gray-400" : "text-black"
              }`}
            >
              <TfiMenuAlt />
            </button>
          </div>
        </div>

        <div className="flex flex-5 justify-end gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-10 h-10 border-2 border-dotted border-sky-400 bg-transparent hover:bg-sky-100 text-sky-600 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <AiOutlinePlus className="text-3xl leading-none" />
          </button>
          <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white cursor-pointer rounded-md flex items-center justify-center transition-colors duration-200">
            <CgProfile className="text-3xl leading-none" />
          </button>
          <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white cursor-pointer rounded-md flex items-center justify-center transition-colors duration-200">
            <IoIosBriefcase className="text-3xl leading-none" />
          </button>
        </div>
      </div>

      {/* Main content */}
      {kanbanIsActive ? (
        <KanbanBoard
          tasks={tasks}
          onTaskMove={moveTask}
          onTaskClick={navigateToTask}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onScrollEndChange={setIsKanbanScrolledToEnd}
        />
      ) : (
        <TasksTable
          tasks={tasks}
          onRowClick={navigateToTask}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      {selectedTask && (
        <>
          <EditTaskModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            task={selectedTask}
            onSave={handleUpdate}
          />

          <DeleteTaskModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default TasksPage;
