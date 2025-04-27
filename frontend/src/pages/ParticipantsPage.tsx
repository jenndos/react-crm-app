import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import AddParticipantModal from "../components/AddParticipantModal";
import ParticipantCard from "../components/ParticipantCard"; // Import the new component

interface Participant {
  id: number;
  name: string;
  surname: string;
  position: string;
  email: string;
  phone: string;
  city: string;
  birth_date: string;
}

export default function ParticipantsPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const fetchParticipants = useCallback(
    async (abortSignal?: AbortSignal) => {
      try {
        if (!userId) {
          throw new Error("Требуется ID пользователя");
        }

        const response = await axios.get(
          `http://localhost:5000/api/participants?user_id=${userId}`,
          { signal: abortSignal }
        );
        setParticipants(response.data.participants);
        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchParticipants(abortController.signal);
    return () => abortController.abort();
  }, [fetchParticipants]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="pl-8 pb-8 pt-12 pr-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl">Участники</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 px-3 py-2 rounded-md text-white hover:bg-sky-700 transition-colors"
        >
          + Добавить участника
        </button>
      </div>

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(475px,1fr))]">
        {participants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </div>

      {isModalOpen && (
        <AddParticipantModal
          onClose={() => setIsModalOpen(false)}
          userId={userId || ""}
          onParticipantAdded={fetchParticipants}
        />
      )}
    </div>
  );
}
