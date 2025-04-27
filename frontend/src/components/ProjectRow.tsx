import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Project } from "../pages/ProjectsPage";

interface ProjectRowProps {
  project: Project;
  onRowClick: (projectId: number) => void;
  onEdit: (e: React.MouseEvent, project: Project) => void;
  onDelete: (e: React.MouseEvent, project: Project) => void;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "Разработка":
      return "bg-blue-100 text-blue-800";
    case "Идея":
      return "bg-green-100 text-green-800";
    case "Готово":
      return "bg-orange-100 text-yellow-800";
    default:
      return "";
  }
};

const ProjectRow = React.memo(
  ({ project, onRowClick, onEdit, onDelete }: ProjectRowProps) => (
    <tr
      key={project.id}
      onDoubleClick={() => onRowClick(project.id)}
      className="hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-6 py-3">{project.id}</td>
      <td className="px-6 py-3">{project.name}</td>
      <td className="px-6 py-3">{project.description}</td>
      <td className="px-6 py-3">{project.curator}</td>
      <td className="px-6 py-3">{project.executor}</td>
      <td className="px-6 py-3 align-middle">
        <span className={`inline-block px-3 py-2 rounded-md text-sm ${getStatusClass(project.status)}`}>
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-start h-full space-x-2 text-xl">
          <button
            onClick={(e) => onEdit(e, project)}
            className="text-gray-500 hover:text-blue-700 cursor-pointer"
          >
            <MdEdit />
          </button>
          <button
            onClick={(e) => onDelete(e, project)}
            className="text-gray-500 hover:text-red-700 cursor-pointer"
          >
            <MdDelete />
          </button>
        </div>
      </td>
    </tr>
  )
);

export default ProjectRow;