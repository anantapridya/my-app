import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function Login() {
  // ** Lib Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  // #region ===== Data =====
  // ** STate Management
  const [select, setSelect] = useState("login");

  // ** Form Handler
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
  } = useForm();

  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
  } = useForm();
  // #endregion

  // #region ===== Function =====
  // ** Handle
  async function handleLogin(data: any) {
    const body = {
      email: data.email,
      password: data.password,
      redirect: false,
    };

    try {
      const res = await signIn("credentials", body);
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.status === 200) {
        toast.success("Login Successfully", {
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
        setTimeout(() => {
          router.push(callbackUrl);
        }, 2000);
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
    }
  }

  const handleSignUp = async (data: any) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_DEV}/api/auth/signup`,
        data
      );
      toast.success("Register Successfully", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
      setTimeout(() => {
        resetRegister();
        setSelect("login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during registration.", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
    }
  };

  // ** Effects
  useEffect(() => {
    resetLogin();
    resetRegister();
  }, [select]);
  // #endregion

  return (
    <div
      style={{ zIndex: 1 }}
      className={`w-screen h-screen bg-white flex flex-col md:flex-row`}
    >
      <ToastContainer />
      <div className="w-full h-full flex flex-col items-center justify-center bg-blue-700 p-4 rounded-r-xl">
        <p className="font-bold text-2xl md:text-4xl text-white mb-2 md:mb-4 text-center">
          Welcome to Programmer Freelance
        </p>
        <p className="text-white text-sm md:text-base text-center">
          PT. Lautan Natural Krimerindo
        </p>
      </div>
      {select === "login" && (
        <form
          onSubmit={handleLoginSubmit(handleLogin)}
          className="w-full h-full flex flex-col items-center justify-center p-4 bg-white"
        >
          <p className="text-lg md:text-2xl mb-4">Login</p>
          <div className="form-group mb-4 grid md:grid-cols-2">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <Controller
              name="email"
              control={loginControl}
              defaultValue=""
              render={({ field }) => (
                <InputText
                  id="email"
                  {...field}
                  placeholder="Email"
                  className="w-full"
                  required
                />
              )}
            />
          </div>
          <div className="form-group mb-4 grid md:grid-cols-2">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <Controller
              name="password"
              control={loginControl}
              defaultValue=""
              render={({ field }) => (
                <InputText
                  id="password"
                  type="password"
                  {...field}
                  placeholder="Password"
                  className="w-full"
                  required
                />
              )}
            />
          </div>
          <Button
            type="submit"
            label="Submit"
            className="p-button p-component btn btn-primary bg-blue-500 text-white py-2 rounded w-full"
          />
          <a onClick={() => setSelect("signup")} className="mt-4">
            Don't have an account? Sign Up
          </a>
        </form>
      )}
      {select === "signup" && (
        <form
          onSubmit={handleRegisterSubmit(handleSignUp)}
          className="w-full h-full flex flex-col items-center justify-center p-4 bg-white"
        >
          <p className="text-lg md:text-2xl mb-4">Sign Up</p>
          <div className="form-group mb-4 grid md:grid-cols-2">
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <Controller
              name="username"
              control={registerControl}
              defaultValue=""
              render={({ field }) => (
                <InputText
                  id="username"
                  {...field}
                  placeholder="Username"
                  className="w-full"
                  required
                />
              )}
            />
          </div>
          <div className="form-group mb-4 grid md:grid-cols-2">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <Controller
              name="email"
              control={registerControl}
              defaultValue=""
              render={({ field }) => (
                <InputText
                  id="email"
                  {...field}
                  placeholder="Email"
                  className="w-full"
                  required
                />
              )}
            />
          </div>
          <div className="form-group mb-4 grid md:grid-cols-2">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <Controller
              name="password"
              control={registerControl}
              defaultValue=""
              render={({ field }) => (
                <InputText
                  id="password"
                  type="password"
                  {...field}
                  placeholder="Password"
                  className="w-full"
                  required
                />
              )}
            />
          </div>
          <Button
            type="submit"
            label="Submit"
            className="p-button p-component btn btn-primary bg-blue-500 text-white py-2 rounded w-full"
          />
          <a onClick={() => setSelect("login")} className="mt-4">
            Already have an account? Sign In
          </a>
        </form>
      )}
    </div>
  );
}
