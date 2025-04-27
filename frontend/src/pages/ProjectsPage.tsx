// Optimized

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import DeleteProjectModal from "../components/DeleteProjectModal";
import { MdEdit, MdDelete } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { IoIosBriefcase } from "react-icons/io";
import axios from "axios";
import ProjectRow from "../components/ProjectRow";

export interface Project {
  id: number;
  name: string;
  description: string;
  curator: string;
  executor: string;
  status: string;
  deadline: string;
  creator: string;
  guest: string;
}

const API_BASE_URL = "http://localhost:5000/api/projects";

export default function ProjectsPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setError("User ID is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}?user_id=${userId}`);
      setProjects(response.data.projects);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (projectData: Omit<Project, "id">) => {
    try {
      const response = await axios.post(API_BASE_URL, {
        ...projectData,
        user_id: userId,
      });
      setProjects((prev) => [...prev, response.data.project]);
      setIsCreateModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleUpdate = async (updatedProject: Project) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${updatedProject.id}`,
        updatedProject
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.id === updatedProject.id ? response.data.project : p
        )
      );
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;

    try {
      await axios.delete(`${API_BASE_URL}/${selectedProject.id}`);
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const openProject = (projectId: number) => {
    navigate(`/projects/${projectId}?user_id=${userId}`);
  };

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const tableHeaders = [
    "ID",
    "Название",
    "Описание",
    "Куратор",
    "Исполнитель",
    "Статус",
  ];

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

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between mt-4 mb-12">
        <h1 className="text-3xl">Проекты</h1>
        <div className="flex gap-2">
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

      <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="border-b border-gray-200">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                className="font-bold px-6 py-3 text-left text-xs font-medium tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 font-light">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onRowClick={openProject}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </tbody>
      </table>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      {selectedProject && (
        <>
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            project={selectedProject}
            onSave={handleUpdate}
          />
          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
}
