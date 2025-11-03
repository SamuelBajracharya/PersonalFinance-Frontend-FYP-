"use client";

import Logo from "@/components/gloabalComponents/Logo";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import { TempTokenResponse } from "@/types/authAPI";
import { useState } from "react";

interface ResetRequest {
  email: string;
}

const RequestReset = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutate: requestReset } = useRequestPasswordReset();

  const onFinish = (values: ResetRequest) => {
    setLoading(true);

    // Call the request password reset hook
    requestReset(values.email, {
      onSuccess: (res: TempTokenResponse) => {
        Cookies.set("tempToken", res.temp_token, {
          expires: 1 / 24, // expires in 1 hour
          secure: true,
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
    <div className="min-h-screen flex flex-col items-center justify-center w-full text-white px-6">
      {/* Logo */}
      <div className="mb-4">
        <Logo width={240} />
      </div>

      <div className="text-lg my-8 max-w-md">
        <h2 className="text-4xl font-semibold text-primary text-center">
          Forgot Password
        </h2>
        <p className="mt-4 text-textmain text-center">
          Enter your registered email below, we’ll send a 6-digit code to your
          email.
        </p>
      </div>

      <Form
        name="requestReset"
        onFinish={onFinish}
        layout="vertical"
        className="w-full max-w-md flex flex-col space-y-4"
      >
        {/* Email */}
        <Form.Item
          name="email"
          label={<span className="text-white text-lg">Email</span>}
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input
            placeholder="enter your email address"
            className="!bg-accentBG !text-textmain !placeholder-gray-300 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
          />
        </Form.Item>

        {/* Send OTP Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg !py-6 !rounded-full !font-semibold !w-full !border-none !transition mt-4"
          >
            {loading ? "Sending..." : "Send OTP Code"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RequestReset;
