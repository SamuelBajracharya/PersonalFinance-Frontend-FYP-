"use client";

import Logo from "@/components/gloabalComponents/Logo";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import { TempTokenResponse } from "@/types/authAPI";
import { useState } from "react";
import Image from "next/image";

interface ResetRequest {
  email: string;
}

const RequestReset = () => {
  const router = useRouter();
  const secureCookie = process.env.NODE_ENV === "production";
  const [loading, setLoading] = useState(false);
  const { mutate: requestReset } = useRequestPasswordReset();

  const onFinish = (values: ResetRequest) => {
    setLoading(true);

    // Call the request password reset hook
    requestReset(values.email, {
      onSuccess: (res: TempTokenResponse) => {
        Cookies.set("tempToken", res.temp_token, {
          expires: 1 / 24, // expires in 1 hour
          secure: secureCookie,
          sameSite: "strict",
        });

        message.success("Verification code sent to your email!");
        router.push("/auth/verify/password_reset");
      },
      onError: (error: Error) => {
        message.error(error.message || "No account found with that email");
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div className="flex flex-col items-center h-full w-full text-white px-4 py-4 max-w-md mx-auto md:justify-center md:h-auto">
      {/* Desktop Logo */}
      <div className="hidden md:block mb-4">
        <Logo width={240} />
      </div>

      {/* Mobile Illustration Banner */}
      <div className="w-full flex-grow flex-1 relative rounded-3xl overflow-hidden shadow-2xl mb-6 md:hidden min-h-[150px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/auth_image.png"
          alt="auth-image"
          className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/40" />
      </div>

      {/* Reset Form and Titles */}
      <div className="w-full flex flex-col items-center shrink-0">
        <div className="text-lg mb-6 w-full">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center">
            Forgot Password
          </h2>
          <p className="mt-3 text-textsecondary text-center text-base md:text-lg">
            Enter your registered email below, we’ll send a 6-digit code to your
            email.
          </p>
        </div>

        <Form
          name="requestReset"
          onFinish={onFinish}
          layout="vertical"
          className="w-full flex flex-col space-y-4"
        >
          {/* Email */}
          <Form.Item
            name="email"
            label={<span className="text-white text-base md:text-lg">Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input
              placeholder="enter your email address"
              className="!bg-accentBG !text-textmain !placeholder-gray-400 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
            />
          </Form.Item>

          {/* Send OTP Button */}
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg !py-6 !rounded-full !font-semibold !w-full !border-none !transition mt-4 cursor-pointer"
            >
              {loading ? "Sending..." : "Send OTP Code"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RequestReset;
