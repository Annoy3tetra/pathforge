import { useState } from "react";

import API from "../api/axios";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const params = new URLSearchParams();

      params.append(
        "username",
        formData.email
      );

      params.append(
        "password",
        formData.password
      );

      const response = await API.post(
        "/auth/login",
        params,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      login(
        response.data.access_token
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-96"
      >
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-700"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-slate-700"
          onChange={handleChange}
        />

        <button
          className="w-full bg-green-600 p-3 rounded font-bold"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default LoginPage;