import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Task } from "../pages/TasksPage";

interface TaskCardProps {
  task: Task;
  onDoubleClick: () => void;
  onEdit: (task: Task, e: React.MouseEvent) => void;
  onDelete: (task: Task, e: React.MouseEvent) => void;
}

const TaskCard = React.memo(
  ({ task, onDoubleClick, onEdit, onDelete }: TaskCardProps) => (
    <div
      className="bg-white rounded-lg shadow py-4 px-6 mb-4 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("taskId", task.id.toString())}
      onDoubleClick={onDoubleClick}
    >
      <h3 className="font-medium text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-500 mt-3">{task.description}</p>

      <div className="flex justify-between items-end">
        <div className="flex -space-x-2 mt-5">
          {[1, 2].slice(0, 2).map((avatar, index) => (
            <div
              key={index}
              className={`w-10 h-10 bg-gray-300 rounded-full border border-gray-400 ${index > 2 ? "" : ""}`}
            />
          ))}
          {[1, 2, 3].length > 2 && (
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              +{[1, 2, 3, 4].length - 2}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end h-full space-x-2 text-xl">
          <button
            onClick={(e) => onEdit(task, e)}
            className="text-gray-500 hover:text-blue-700 cursor-pointer"
          >
            <MdEdit />
          </button>
          <button
            onClick={(e) => onDelete(task, e)}
            className="text-gray-500 hover:text-red-700 cursor-pointer"
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  )
);

export default TaskCard;