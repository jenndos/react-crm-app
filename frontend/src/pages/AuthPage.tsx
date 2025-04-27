import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useValidation = (value: string, validations: any) => {
  const [isEmpty, setEmpty] = useState(true);
  const [isLoginError, setLoginError] = useState(false);
  const [isPasswordError, setPasswordError] = useState(false);
  const [inputValid, setInputValid] = useState(false);

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case "isEmpty":
          value ? setEmpty(false) : setEmpty(true);
          break;
        case "isLogin":
          break;
        case "isPassword":
          const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
          regexPassword.test(String(value))
            ? setPasswordError(false)
            : setPasswordError(true);
      }
    }
  }, [value]);

  useEffect(() => {
    if (isEmpty || isLoginError || isPasswordError) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, isLoginError, isPasswordError]);

  return {
    isEmpty,
    isLoginError,
    isPasswordError,
    inputValid,
  };
};

const useInput = (initialValue: string, validations: any) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setDirty(true);
  };

  return {
    value,
    onChange,
    onBlur,
    isDirty,
    ...valid,
  };
};

export default function AuthPage() {
  const login = useInput("", { isEmpty: true, isLogin: false });
  const password = useInput("", { isEmpty: true, isPassword: false });
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          login: login.value,
          password: password.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        navigate(`/main?user_id=${response.data.user.id}`);
      } else {
        setAuthError(response.data.error);
      }
    } catch (error) {
      let errorMessage = "Неверный логин или пароль";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status code
          if (error.response.status === 404) {
            errorMessage = "Сервер недоступен";
          } else {
            errorMessage = error.response.data?.error || errorMessage;
          }
        } else if (error.request) {
          // No response received
          errorMessage = "Сервер недоступен";
        }
      }

      setAuthError(errorMessage);
      console.error("Full error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="flex items-center justify-center h-screen w-1/2 bg-[#f8f8f8]">
        <img
          src={logo}
          alt="Logo"
          className="w-[80%] h-[600px] object-contain"
        />
      </div>

      <div className="flex items-center justify-center h-screen w-1/2">
        <div className="w-full max-w-xl px-8">
          <h1 className="font-nunito tracking-wide text-2xl font-bold text-4xl mb-10">Авторизация</h1>
          <form
            action=""
            method="post"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2">
                Логин
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`
                    bg-[#f3f5f9] rounded-lg p-3 shadow-[0_2px_0_0_rgba(0,0,0,0.2)]
                    outline-none transition-all duration-200
                    border-2 border-transparent focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500
                  `}
                placeholder="tualetniy.utenokgmil.com"
                value={login.value}
                onBlur={() => login.onBlur()}
                onChange={(e) => login.onChange(e)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`
                  bg-[#f3f5f9] rounded-lg p-3 shadow-[0_2px_0_0_rgba(0,0,0,0.2)]
                  outline-none transition-all duration-200
                  border-2 border-transparent focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500
                `}
                placeholder="gxasgxAGC728lxsxko"
                value={password.value}
                onChange={(e) => password.onChange(e)}
                onBlur={(e) => password.onBlur()}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Войти"}
            </button>

            {authError && <div className="text-red-500">{authError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
