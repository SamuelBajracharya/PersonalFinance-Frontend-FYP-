"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/gloabalComponents/Logo";
import { useRegister } from "@/hooks/useAuth";
import Cookies from "js-cookie";

interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values: SignUpRequest) => {
    register(values, {
      onSuccess: (data) => {
        Cookies.set("tempToken", data.temp_token, {
          expires: 1 / 24,
          secure: true,
          sameSite: "strict",
        });

        messageApi.success("Registration successful! Please verify OTP.");
        router.push("/auth/verify/email_verification");
      },
      onError: (error: any) => {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";

        // show toast
        messageApi.error(errMsg);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full text-white px-6">
      {contextHolder}

      {/* Logo */}
      <div className="mb-4">
        <Logo width={220} />
      </div>
      <h2 className="text-xl font-semibold mb-12">Create Your Account</h2>

      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        validateTrigger="onSubmit"
        className="w-full max-w-md flex flex-col space-y-4"
      >
        {/* Email */}
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            placeholder="email"
            className="!bg-accentBG !text-textmain !placeholder-gray-300 !rounded-full 
              !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
          />
        </Form.Item>

        {/* Name */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            placeholder="name"
            className="!bg-accentBG !text-textmain !placeholder-gray-300 
              !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
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

        {/* Remember Me */}
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <div className="flex items-center space-x-2 ">
            <Checkbox className="!accent-primary bg-accentBG !text-gray-300" />
            <label
              htmlFor="remember"
              className="text-gray-300 ml-2 !text-[1.1rem]"
            >
              Remember Me
            </label>
          </div>
        </Form.Item>

        {/* Sign Up Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            loading={isPending}
            className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg !py-6 !rounded-full 
              !font-semibold !w-full !border-none !transition mt-4"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </Form.Item>

        {/* Sign In Link */}
        <p className="text-center text-lg text-gray-300">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-2 text-gray-400 text-lg">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <Button
          className="!flex !items-center !justify-center !bg-accentBG hover:!bg-accentBG/80 !py-6 
            !rounded-full !space-x-1 !transition !border-none !text-textmain !w-full !text-lg"
        >
          <FaGoogle />
          <span>Continue With Google</span>
        </Button>

        <Button
          className="!flex !items-center !justify-center !bg-accentBG hover:!bg-accentBG/80 !py-6 
            !rounded-full !space-x-1 !transition !border-none !text-textmain !w-full !text-lg"
        >
          <FaFacebook className="text-blue-500" />
          <span>Continue With Facebook</span>
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
