"use client";

import Logo from "@/components/gloabalComponents/Logo";
import { Form, Input, Button, message } from "antd";
import { useResetPassword } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface ResetRequest {
  password?: string;
  confirmPassword?: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values: ResetRequest) => {
    if (!values.password || !values.confirmPassword) {
      messageApi.error("Please fill in both password fields");
      return;
    }

    if (values.password !== values.confirmPassword) {
      messageApi.error("Passwords do not match");
      return;
    }

    resetPassword(
      { new_password: values.password },
      {
        onSuccess: () => {
          messageApi.success("Password reset successfully!");
          router.push("/success/password_reset");
        },
        onError: (err: any) => {
          messageApi.error(
            err?.response?.data?.message || "Failed to reset password"
          );
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center h-full w-full text-white px-4 py-4 max-w-md mx-auto md:justify-center md:h-auto">
      {contextHolder}
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

      {/* Change Password Form and Titles */}
      <div className="w-full flex flex-col items-center shrink-0">
        <div className="text-lg mb-6 w-full">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center">
            Reset Password
          </h2>
          <p className="mt-3 text-textsecondary text-center text-base md:text-lg">
            Password must be 8 characters long with a combination of letters,
            numbers and symbols.
          </p>
        </div>

        <Form
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
          className="w-full flex flex-col space-y-3"
        >
          {/* Password */}
          <Form.Item
            name="password"
            label={<span className="text-white text-base md:text-lg">Password</span>}
            rules={[{ required: true, message: "Please enter new password" }]}
          >
            <Input
              placeholder="enter your new password"
              className="!bg-accentBG !text-textmain !placeholder-gray-400 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            label={<span className="text-white text-base md:text-lg">Confirm Password</span>}
            rules={[{ required: true, message: "Please re-enter new password" }]}
          >
            <Input
              placeholder="re-enter your new password"
              className="!bg-accentBG !text-textmain !placeholder-gray-400 !rounded-full !py-3 !px-5 !border-none !focus:ring-2 !focus:ring-yellow-400 !text-lg"
            />
          </Form.Item>

          {/* Reset Password Button */}
          <Form.Item>
            <Button
              htmlType="submit"
              loading={isPending}
              className="!bg-primary hover:!bg-primary/80 !text-textmain !text-lg !py-6 !rounded-full !font-semibold !w-full !border-none !transition mt-4 cursor-pointer"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
