import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";
import axios from "axios";

interface UserData {
  id: number;
  name: string;
  surname: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
}

export default function UserProjectsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("user_id");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("User ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        setUserData(userResponse.data.user);

        const projectsResponse = await axios.get(
          `http://localhost:5000/api/projects?user_id=${userId}`
        );
        setProjects(projectsResponse.data.projects);

        if (projectsResponse.data.projects.length > 0) {
          navigate("/projects?user_id=" + userId);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleCreateProject = async (projectData: Omit<Project, "id">) => {
    try {
      const response = await axios.post("http://localhost:5000/api/projects", {
        ...projectData,
        user_id: userId,
      });
      navigate(`/projects?user_id=${userId}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="font-nunito tracking-wide text-4xl text-center mb-18">
        Привет, {userData?.name}! У тебя еще нет
        <br /> ни одного проекта
      </h1>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-3xl"
      >
        + Создать проект
      </button>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
