import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Task } from "../pages/TasksPage";
import { STATUS_BG_COLORS } from "../constants/taskStatuses";

interface TasksTableProps {
  tasks: Task[];
  onRowClick: (taskId: number) => void;
  onEdit: (task: Task, e: React.MouseEvent) => void;
  onDelete: (task: Task, e: React.MouseEvent) => void;
}

const TasksTable = React.memo(
  ({ tasks, onRowClick, onEdit, onDelete }: TasksTableProps) => (
    <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
      <thead className="border-b border-gray-200">
        <tr>
          {["ID", "Название", "Описание", "Куратор", "Исполнитель", "Статус"].map(
            (header) => (
              <th
                key={header}
                className="font-bold px-6 py-3 text-left text-xs font-medium tracking-wider"
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 font-light">
        {tasks.map((task) => (
          <tr
            key={task.id}
            onDoubleClick={() => onRowClick(task.id)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            <td className="px-6 py-3">{task.id}</td>
            <td className="px-6 py-3">{task.title}</td>
            <td className="px-6 py-3">{task.description}</td>
            <td className="px-6 py-3">{task.curator}</td>
            <td className="px-6 py-3">{task.executor}</td>
            <td className="px-6 py-3 align-middle">
              <span
                className={`inline-block px-3 py-2 rounded-md text-sm ${
                  STATUS_BG_COLORS[task.status]
                }`}
              >
                {task.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-start h-full space-x-2 text-xl">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
);

export default TasksTable;