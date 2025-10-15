"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import Link from "next/link";

interface LoginRequest {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = (values: LoginRequest) => {
    console.log("Form values:", values);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full text-white px-6">
      {/* Logo */}
      <h1 className="text-3xl font-extrabold mb-4 tracking-wide">LOGO</h1>
      <h2 className="text-xl font-semibold mb-12">Welcome Back!</h2>

      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className="w-full max-w-md flex flex-col space-y-4"
      >
        {/* Email */}
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            placeholder="email"
            className="!bg-accentBG !text-textmain !placeholder-gray-300 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="!bg-accentBG !text-textmain !placeholder-gray-300 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
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
          {/* Remember Me */}
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <div className="flex items-center space-x-2">
              <Checkbox className="!accent-primary bg-accentBG !text-gray-300" />
              <label
                htmlFor="remember"
                className="text-gray-300 ml-2 !text-[1.1rem]"
              >
                Remember Me
              </label>
            </div>
          </Form.Item>

          {/* Forgot Password */}
          <button
            type="button"
            className="text-accent hover:underline text-[1.1rem] cursor-pointer"
          >
            <Link href="/auth/request-reset">Forgot Password?</Link>
          </button>
        </div>

        {/* Sign Up Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg !py-6 !rounded-full !font-semibold !w-full !border-none !transition mt-4"
          >
            Login
          </Button>
        </Form.Item>

        {/* Sign In Link */}
        <p className="text-center text-lg text-gray-300">
          Dont have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-2 text-gray-400 text-lg">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Google Button */}
        <Button className="!flex !items-center !justify-center !bg-accentBG hover:!bg-accentBG/80 !py-6 !rounded-full !space-x-1 !transition !border-none !text-textmain !w-full !text-lg">
          <FaGoogle />
          <span>Continue With Google</span>
        </Button>

        {/* Facebook Button */}
        <Button className="!flex !items-center !justify-center !bg-accentBG hover:!bg-accentBG/80 !py-6 !rounded-full !space-x-1 !transition !border-none !text-textmain !w-full !text-lg">
          <FaFacebook className="text-blue-500" />
          <span>Continue With Facebook</span>
        </Button>
      </Form>
    </div>
  );
};

export default Login;
