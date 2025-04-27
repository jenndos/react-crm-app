import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-3xl">
      <h1 className="text-center">404 Ошибка. Страница не найдена!</h1>
      <a href="/register" className="text-indigo-600 text-lg text-sky-900 mt-2">
        Вернуться на главную страницу
      </a>
    </div>
  );
}
