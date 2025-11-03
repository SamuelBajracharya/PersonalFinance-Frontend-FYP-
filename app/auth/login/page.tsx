"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Logo from "@/components/gloabalComponents/Logo";
import { LoginData } from "@/types/authAPI";
import { useLogin } from "@/hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values: LoginData) => {
    const loginData: LoginData = {
      email: values.email,
      password: values.password,
    };

    login(loginData, {
      onSuccess: (data) => {
        if (data.temp_token) {
          Cookies.set("tempToken", data.temp_token, {
            expires: 1 / 24,
            secure: true,
            sameSite: "strict",
          });

          messageApi.success("Login successful! Please verify your 2FA code.");
          router.push("/auth/verify/two_factor_auth");
        } else {
          messageApi.error("No verification token received.");
        }
      },
      onError: (error: any) => {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";

        messageApi.error(errMsg);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full text-white px-6">
      {/* This makes the fucking toasts show */}
      {contextHolder}

      <div className="mb-4">
        <Logo width={220} />
      </div>

      <h2 className="text-xl font-semibold mb-12">Welcome Back!</h2>

      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        validateTrigger="onSubmit"
        className="w-full max-w-md flex flex-col space-y-4"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            placeholder="email"
            className="!bg-accentBG !text-textmain !placeholder-gray-300 
            !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="!bg-accentBG !text-textmain !placeholder-gray-300 
              !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 !text-xl cursor-pointer"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <div className="flex items-center space-x-2">
              <Checkbox className="!accent-primary bg-accentBG !text-gray-300" />
              <label className="text-gray-300 ml-2 !text-[1.1rem]">
                Remember Me
              </label>
            </div>
          </Form.Item>

          <Link
            href="/auth/request-reset"
            className="text-accent hover:underline text-[1.1rem]"
          >
            Forgot Password?
          </Link>
        </div>

        <Form.Item>
          <Button
            htmlType="submit"
            loading={isPending}
            className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg 
            !py-6 !rounded-full !font-semibold !w-full !border-none !transition mt-4"
          >
            {isPending ? "Logging In..." : "Login"}
          </Button>
        </Form.Item>

        <p className="text-center text-lg text-gray-300">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-2 text-gray-400 text-lg">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <Button
          className="!flex !items-center !justify-center !bg-accentBG hover:!bg-accentBG/80 
          !py-6 !rounded-full !space-x-1 !transition !border-none !text-textmain !w-full !text-lg"
        >
          <FaGoogle />
          <span>Continue With Google</span>
        </Button>

        <Button
          className="!flex !items-center !justify-center !bg-accentBG hover:!bg-accentBG/80 
          !py-6 !rounded-full !space-x-1 !transition !border-none !text-textmain !w-full !text-lg"
        >
          <FaFacebook className="text-blue-500" />
          <span>Continue With Facebook</span>
        </Button>
      </Form>
    </div>
  );
};

export default Login;
