// Optimized

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import EditProjectModal from "../components/EditProjectModal";
import DeleteProjectModal from "../components/DeleteProjectModal";
import { formatDateTime } from "../utils/dateFormat";

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  deadline: string;
  curator: string;
  executor: string;
  creator: string;
  guest: string;
}

type ProjectDetailItem = {
  label: string;
  value: string;
  type: "text" | "avatar" | "avatars";
  count?: number;
};

const STATUS_STYLES = {
  "Разработка": "bg-blue-100 text-blue-800",
  "Идея": "bg-green-100 text-green-800",
  "default": "bg-orange-100 text-yellow-800"
};

export default function ProjectCardPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
      setProject(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleUpdate = useCallback(async (updatedProject: Omit<Project, 'created_at'> & { created_at?: string }) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/projects/${projectId}`,
        updatedProject
      );
      setProject(data.project);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }, [projectId]);

  const handleDelete = useCallback(async () => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      navigate("/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }, [projectId, navigate]);

  const projectDetails: ProjectDetailItem[] = [
    { label: "Описание", value: project?.description || "", type: "text" },
    { label: "Кто создал задачу", value: project?.creator || "", type: "avatar" },
    { label: "Куратор", value: project?.curator || "", type: "avatars", count: 2 },
    { label: "Исполнитель", value: project?.executor || "", type: "avatars", count: 3 },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  const statusStyle = STATUS_STYLES[project.status as keyof typeof STATUS_STYLES] || STATUS_STYLES.default;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center mr-2 hover:bg-gray-200 rounded-full h-12 w-12"
            aria-label="Go back"
          >
            <LiaLongArrowAltLeftSolid className="text-4xl leading-none" />
          </button>
          <h1 className="text-3xl">Карточка проекта</h1>
        </div>
        <p className="text-2xl">
          {project.id} — {project.name}
        </p>
      </div>

      {/* Card content */}
      <div className="bg-white rounded-lg">
        {/* Card header */}
        <div className="flex items-center h-20">
          {/* Name and Status block */}
          <div className="flex-1 pl-6 flex items-center pr-4 border-gray-300 h-full">
            <h2 className="text-2xl truncate max-w-[300px]">{project.name}</h2>
            <span className={`ml-20 inline-block px-3 py-2 rounded-md text-sm ${statusStyle}`}>
              {project.status}
            </span>
          </div>

          {/* Dates block */}
          <div className="flex justify-between items-center px-6">
            <FormattedDate date={project.created_at} />
            <span className="mx-6 text-gray-500 font-bold">⸺</span>
            <FormattedDate date={project.deadline} />
          </div>

          <div className="w-px h-full bg-gray-300"></div>

          {/* Icons block */}
          <div className="flex justify-end px-5">
            <div className="flex gap-1">
              <IconButton 
                onClick={() => setIsEditModalOpen(true)}
                aria-label="Edit"
                icon={<MdEdit />} ariaLabel={""}              />
              <IconButton 
                onClick={() => setIsDeleteModalOpen(true)}
                aria-label="Delete"
                icon={<MdDelete />} ariaLabel={""}              />
            </div>
          </div>
        </div>

        <hr className="text-gray-300" />

        {/* Card details */}
        <div className="grid grid-cols-[20%_80%] p-6 relative">
          <div className="absolute left-[20%] inset-y-0 w-px bg-gray-300" />
          
          {projectDetails.map((item) => (
            <ProjectDetailRow key={item.label} item={item} />
          ))}
        </div>

        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={project}
          onSave={handleUpdate as (project: Project) => void}
        />

        <DeleteProjectModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}

// Helper components
const FormattedDate = ({ date }: { date: string }) => (
  <p className="text-gray-600">
    {formatDateTime(date).split(" ").map((part, index) => (
      <span key={index} className={index === 0 ? "mr-6" : ""}>
        {part}
      </span>
    ))}
  </p>
);

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
}

const IconButton = ({ onClick, icon, ariaLabel }: IconButtonProps) => (
  <button
    onClick={onClick}
    className="text-xl text-gray-500 p-2 rounded hover:bg-gray-100"
    aria-label={ariaLabel}
  >
    {icon}
  </button>
);

const ProjectDetailRow = ({ item }: { item: ProjectDetailItem }) => (
  <>
    <div className="pb-6">
      <div className="pr-4 text-gray-700 h-full flex items-center">
        {item.label}
      </div>
    </div>

    <div className="pb-6 pl-4">
      {item.type === "text" ? (
        <div>{item.value}</div>
      ) : (
        <div className="flex items-center gap-3">
          {item.type === "avatar" ? (
            <Avatar />
          ) : (
            <div className="flex -space-x-2">
              {Array.from({ length: item.count || 2 }).map((_, i) => (
                <Avatar key={i} />
              ))}
            </div>
          )}
          <p>{item.value}</p>
        </div>
      )}
    </div>
  </>
);

const Avatar = () => (
  <div className="w-10 h-10 bg-gray-300 rounded-full border border-gray-400" />
);
