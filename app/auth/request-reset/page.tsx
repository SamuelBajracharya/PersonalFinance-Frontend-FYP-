"use client";

import Logo from "@/components/gloabalComponents/Logo";
import { Form, Input, Button } from "antd";

interface ResetRequest {
  email: string;
}

const RequestReset = () => {
  const onFinish = (values: ResetRequest) => {
    console.log("Form values:", values);
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
          Enter your registered email below, we’ll send 6 digit code to your
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
          rules={[{ required: true, message: "Please enter your email" }]}
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
            className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg !py-6 !rounded-full !font-semibold !w-full !border-none !transition mt-4"
          >
            Send OTP Code
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RequestReset;
