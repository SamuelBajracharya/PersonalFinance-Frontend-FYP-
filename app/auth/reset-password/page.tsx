"use client";

import Logo from "@/components/gloabalComponents/Logo";
import { Form, Input, Button } from "antd";

interface ResetRequest {
  email: string;
}

const ResetPassword = () => {
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
          Reset Password
        </h2>
        <p className="mt-4 text-textmain text-center">
          Password must be 8 characters long with a combination of letters,
          numbers and symbols.
        </p>
      </div>
      <Form
        name="resetPassword"
        onFinish={onFinish}
        layout="vertical"
        className="w-full max-w-md flex flex-col space-y-2"
      >
        {/* Password */}
        <Form.Item
          name="password"
          label={<span className="text-white text-lg">Password</span>}
          rules={[{ required: true, message: "Please enter new password" }]}
        >
          <Input
            placeholder="enter your new password"
            className="!bg-accentBG !text-textmain !placeholder-gray-300 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label={<span className="text-white text-lg">Confirm Password</span>}
          rules={[{ required: true, message: "Please re-enter new password" }]}
        >
          <Input
            placeholder="re-enter your new password"
            className="!bg-accentBG !text-textmain !placeholder-gray-300 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
          />
        </Form.Item>

        {/* Reset Password Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg !py-6 !rounded-full !font-semibold !w-full !border-none !transition mt-4"
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
