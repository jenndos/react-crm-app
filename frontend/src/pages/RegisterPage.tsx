import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [onlyLettersError, setLettersError] = useState(false);
  const [isEmailError, setEmailError] = useState(false);
  const [isPasswordError, setPasswordError] = useState(false);
  const [inputValid, setInputValid] = useState(false);

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case "isEmpty":
          value ? setEmpty(false) : setEmpty(true);
          break;
        case "onlyLetters":
          const regexOnlyLetters = /^[a-zA-Zа-яА-ЯёЁ]+$/;
          regexOnlyLetters.test(String(value))
            ? setLettersError(false)
            : setLettersError(true);
          break;
        case "isEmail":
          const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
          regexEmail.test(String(value))
            ? setEmailError(false)
            : setEmailError(true);
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
    if (isEmpty || onlyLettersError || isEmailError || isPasswordError) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, onlyLettersError, isEmailError, isPasswordError]);

  return {
    isEmpty,
    onlyLettersError,
    isEmailError,
    isPasswordError,
    inputValid,
  };
};

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);

  const onChange = (e) => {
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

export default function RegisterPage() {
  const name = useInput("", { isEmpty: true, onlyLetters: false });
  const surname = useInput("", { isEmpty: true, onlyLetters: false });
  const email = useInput("", { isEmpty: true, isEmail: false });
  const password = useInput("", { isEmpty: true, isPassword: false });
  const navigate = useNavigate();

  const [isSubmitClicked, setSubmitClicked] = useState(false);
  const [isAllFieldsFilled, setAllFieldsFilled] = useState(false);
  const [isAllFieldsValid, setAllFieldsValid] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    setRegistrationError(null);

    const allValid =
      name.inputValid &&
      surname.inputValid &&
      email.inputValid &&
      password.inputValid;

    const allFilled =
      !name.isEmpty && !surname.isEmpty && !email.isEmpty && !password.isEmpty;

    setAllFieldsFilled(allFilled);
    setAllFieldsValid(allValid);

    if (allValid && allFilled) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            name: name.value,
            surname: surname.value,
            email: email.value,
            password: password.value,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Registration successful:", response.data);
        navigate(`/main?user_id=${response.data.userId}`);
      } catch (error) {
        let errorMessage = "Ошибка при регистрации";

        if (axios.isAxiosError(error)) {
          if (error.response) {
            errorMessage = error.response.data?.error || errorMessage;
            if (error.response.status === 409) {
              errorMessage = "Пользователь с таким email уже существует";
            }
          } else if (error.request) {
            errorMessage = "Сервер недоступен";
          }
        } else {
          errorMessage = (error as Error).message;
        }

        setRegistrationError(errorMessage);
        console.error("Registration error:", errorMessage);
      }
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
          <h1 className="font-nunito tracking-wide text-2xl font-bold text-4xl">Регистрация</h1>

          <hr className="border-t border-gray-300 w-full my-7" />

          <form
            action=""
            method="post"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2">
                Имя
              </label>
              {(name.isDirty && name.isEmpty) ||
                (!name.isEmpty && name.onlyLettersError && (
                  <div style={{ color: "red" }}>
                    Может содержать только буквы
                  </div>
                ))}
              <input
                type="text"
                id="name"
                name="name"
                className={`
                    bg-[#f3f5f9] rounded-lg p-3 shadow-[0_2px_0_0_rgba(0,0,0,0.2)]
                    ${
                      !name.isEmpty && name.onlyLettersError
                        ? "border-2 border-red-500"
                        : "border-2 border-transparent focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500"
                    }
                    outline-none transition-all duration-200
                  `}
                placeholder="Игорь58985"
                value={name.value}
                onBlur={() => name.onBlur()}
                onChange={(e) => name.onChange(e)}
              />
            </div>

            {/* Surname */}
            <div className="flex flex-col">
              <label htmlFor="surname" className="mb-2">
                Фамилия
              </label>
              {(surname.isDirty && surname.isEmpty) ||
                (!surname.isEmpty && surname.onlyLettersError && (
                  <div style={{ color: "red" }}>
                    Может содержать только буквы
                  </div>
                ))}
              <input
                type="text"
                id="surname"
                name="surname"
                className={`
                    bg-[#f3f5f9] rounded-lg p-3 shadow-[0_2px_0_0_rgba(0,0,0,0.2)]
                    ${
                      !surname.isEmpty && surname.onlyLettersError
                        ? "border-2 border-red-500"
                        : "border-2 border-transparent focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500"
                    }
                    outline-none transition-all duration-200
                  `}
                placeholder="Кулак4ков6554"
                value={surname.value}
                onBlur={(e) => surname.onBlur()}
                onChange={(e) => surname.onChange(e)}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2">
                Email
              </label>
              {email.isDirty && email.isEmailError && (
                <div style={{ color: "red" }}>
                  Введите корректный адрес электронной почты
                </div>
              )}
              <input
                type="email"
                id="email"
                name="email"
                className={`
                    bg-[#f3f5f9] rounded-lg p-3 shadow-[0_2px_0_0_rgba(0,0,0,0.2)]
                    ${
                      email.isDirty && email.isEmailError
                        ? "border-2 border-red-500"
                        : "border-2 border-transparent focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500"
                    }
                    outline-none transition-all duration-200
                  `}
                placeholder="tualetniy.utenokgmil.com"
                value={email.value}
                onBlur={(e) => email.onBlur()}
                onChange={(e) => email.onChange(e)}
              />
            </div>

            {/* Password */}
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
                    ${
                      password.isDirty && password.isPasswordError
                        ? "border-2 border-red-500"
                        : "border-2 border-transparent focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500"
                    }
                    outline-none transition-all duration-200
                  `}
                placeholder="gxasgxAGC728lxsxko"
                value={password.value}
                onChange={(e) => password.onChange(e)}
                onBlur={(e) => password.onBlur()}
              />
              {password.isDirty && password.isPasswordError && (
                <div style={{ color: "red" }}>
                  Пароль должен содержать заглавные и строчные буквы, цифры и
                  быть не менее 8 символов длиной
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Зарегистрироваться
            </button>

            {registrationError && (
              <div style={{ color: "red" }}>
                Пользователь с таким email уже существует
              </div>
            )}

            {!isAllFieldsFilled && isSubmitClicked && (
              <div style={{ color: "red" }}>
                Все поля обязательны для заполнения
              </div>
            )}

            <a
              href="/login"
              className="text-indigo-600 text-sm text-sky-900 mt-2"
            >
              У вас уже есть учётная запись?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
