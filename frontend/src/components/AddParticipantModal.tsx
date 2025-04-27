import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";

interface AddParticipantModalProps {
  onClose: () => void;
  userId: string;
  onParticipantAdded: () => void;
}

export default function AddParticipantModal({
  onClose,
  userId,
  onParticipantAdded,
}: AddParticipantModalProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Поле не должно быть пустым");
      return;
    }

    try {
      // Check participant existence
      const checkResponse = await axios.get("http://localhost:5000/api/check-participant", {
        params: { email, user_id: userId },
      });

      if (checkResponse.data.exists) {
        if (checkResponse.data.type === "participant") {
          setEmailError("Участник уже находится в списке");
        } else {
          const mockUser = await axios.get("http://localhost:5000/api/mockParticipants", {
            params: { email },
          });

          await axios.post("http://localhost:5000/api/participants", {
            ...mockUser.data.participant,
            user_id: userId,
          });

          onParticipantAdded();
          onClose();
        }
      } else {
        setEmailError("Пользователя не существует");
      }
    } catch (err) {
      setEmailError("Ошибка при проверке участника");
    }
  };

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-gray-50 py-20 rounded-lg w-full max-w-3/4">
        <form onSubmit={handleSubmit} className="w-1/2 m-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-8 top-8 cursor-pointer text-2xl text-gray-500"
          >
            <RxCross1 />
          </button>
          <h2 className="text-4xl font-bold mb-12">Пригласить в проект</h2>

          <label className="block text-sm font-normal text-gray-500 mb-1">
            Введите email
          </label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={`w-full p-2 mb-2 rounded-md bg-gray-100 border ${
              emailError ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}

          <div className="flex mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
            >
              Пригласить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
