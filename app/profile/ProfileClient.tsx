"use client";

import React, { useEffect, useState } from "react";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";
import axios from "axios";

// react-icons
import { MdEmail, MdLock, MdEdit, MdDarkMode, MdLightMode } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";
import { PiWarningFill } from "react-icons/pi";
import { IoLogOutOutline, IoHelpCircleOutline } from "react-icons/io5";
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

import StatCard from "@/components/gloabalComponents/StatCards";
import AchievementCard from "@/components/gloabalComponents/AchievementCard";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useMyUnlockedRewards } from "@/hooks/useRewards";
import {
  useChangeProfilePicture,
  useResetProfilePicture,
} from "@/hooks/useProfilePicture";

import Link from "next/link";
import { Button, Modal, Upload } from "antd";
import {
  useDeleteUserTransactionData,
  useUnlinkBankAccounts,
} from "@/hooks/useBankTransaction";
import { useBankOverlay } from "@/stores/useBankOverlay";

import { useProfileOverlays } from "@/stores/useProfileOverlays";
import TextConfirmationOverlay from "@/components/gloabalComponents/TextConfirmationOverlay";
import { useThemeStore } from "@/stores/useThemeStore";

const resolveUploadFile = (uploadFile?: UploadFile): File | null => {
  if (!uploadFile) {
    return null;
  }

  if (uploadFile.originFileObj instanceof File) {
    return uploadFile.originFileObj;
  }

  const rawFile = uploadFile as unknown;
  if (rawFile instanceof File) {
    return rawFile;
  }

  if (rawFile instanceof Blob) {
    return new File([rawFile], uploadFile.name || "profile-picture.png", {
      type: rawFile.type || "image/png",
    });
  }

  return null;
};

const toDisplayErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const detail = error.response?.data?.detail;

  if (typeof detail === "string" && detail.trim().length > 0) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const parsed = detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "msg" in item) {
          const msg = (item as { msg?: unknown }).msg;
          return typeof msg === "string" ? msg : "";
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");

    if (parsed.length > 0) {
      return parsed;
    }
  }

  if (detail && typeof detail === "object") {
    if ("msg" in detail) {
      const msg = (detail as { msg?: unknown }).msg;
      if (typeof msg === "string" && msg.trim().length > 0) {
        return msg;
      }
    }

    return fallback;
  }

  return error.message || fallback;
};

// XP → Title Logic
function getXpTitle(xp: number) {
  if (xp <= 0) return "Beginner";
  if (xp <= 1000) return "Bronze";
  if (xp <= 2000) return "Silver";
  if (xp <= 3000) return "Gold";
  if (xp <= 4000) return "Platinum";
  if (xp <= 5000) return "Ruby";
  if (xp <= 7000) return "Emerald";
  return "Diamond";
}

const PROFILE_PIC_MODAL_Z_INDEX_CLASS = "!z-[2147483646]";
const PROFILE_PIC_UPLOAD_MODAL_CLASS =
  `${PROFILE_PIC_MODAL_Z_INDEX_CLASS} profile-pic-modal`;
const PROFILE_PIC_CROP_MODAL_CLASS = "!z-[2147483646] profile-pic-crop-modal";
const PROFILE_PIC_MASK_Z_INDEX_CLASS = "!z-[2147483646]";

export default function Profile() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const messageApi = useAntdMessage();
  const [showPassword, setShowPassword] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {
    isBankLinked,
    initialize: initializeBankOverlay,
    setBankLinked,
  } = useBankOverlay();

  const { data: user, isLoading, error } = useCurrentUser();
  const { data: myRewards, isLoading: rewardsLoading } = useMyUnlockedRewards();
  const showInitialSkeletons = isLoading && !user;
  const showLoadingOverlay = showInitialSkeletons || rewardsLoading;

  const unlinkMutation = useUnlinkBankAccounts();
  const deleteDataMutation = useDeleteUserTransactionData();
  const logoutMutation = useLogout();
  const changeProfilePictureMutation = useChangeProfilePicture();
  const resetProfilePictureMutation = useResetProfilePicture();

  const {
    isUnlinkAccountConfirmationOpen,
    openUnlinkAccountConfirmation,
    closeUnlinkAccountConfirmation,
    isDeleteDataConfirmationOpen,
    openDeleteDataConfirmation,
    closeDeleteDataConfirmation,
  } = useProfileOverlays();

  useEffect(() => {
    initializeBankOverlay();
  }, [initializeBankOverlay]);

  const handleUnlink = () => {
    unlinkMutation.mutate(undefined, {
      onSuccess: () => {
        setBankLinked(false);
        closeUnlinkAccountConfirmation();
        messageApi.success("Account unlinked successfully!");
      },
      onError: () => {
        closeUnlinkAccountConfirmation();
        messageApi.error("Failed to unlink account. Try again.");
      }
    });
  };

  const handleDeleteData = () => {
    deleteDataMutation.mutate(undefined, {
      onSuccess: () => {
        closeDeleteDataConfirmation();
        messageApi.success("User transaction data deleted successfully!");
      },
      onError: () => {
        closeDeleteDataConfirmation();
        messageApi.error("Failed to delete user transaction data. Try again.");
      }
    });
  };

  const handleProfilePicUpload = () => {
    const selectedFile = resolveUploadFile(fileList[0]);

    if (!selectedFile) {
      messageApi.error("Please select an image first.");
      return;
    }

    changeProfilePictureMutation.mutate(selectedFile, {
      onSuccess: () => {
        messageApi.success("Profile picture updated successfully.");
        setIsProfilePicModalOpen(false);
        setFileList([]);
      },
      onError: (error) => {
        const errorMessage = toDisplayErrorMessage(
          error,
          "Failed to update profile picture. Try again.",
        );
        messageApi.error(errorMessage);
      },
    });
  };

  const handleProfilePicReset = () => {
    resetProfilePictureMutation.mutate(undefined, {
      onSuccess: () => {
        messageApi.success("Profile picture reset successfully.");
        setIsProfilePicModalOpen(false);
        setFileList([]);
      },
      onError: (error) => {
        const errorMessage = toDisplayErrorMessage(
          error,
          "Failed to reset profile picture. Try again.",
        );
        messageApi.error(errorMessage);
      },
    });
  };

  const uploadProps: UploadProps = {
    accept: "image/*",
    maxCount: 1,
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList: nextFileList }) => {
      setFileList(nextFileList.slice(-1));
    },
    onRemove: () => {
      setFileList([]);
      return true;
    },
  };

  return (
    <div className="p-6">
      {error && !showInitialSkeletons && (
        <p className="mb-6 text-red-500">Failed to load user</p>
      )}
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start text-center md:text-left">
        {showInitialSkeletons ? (
          <SkeletonBlock className="size-32 md:size-48 rounded-full" />
        ) : (
          <div className="relative size-32 md:size-48">
            <img
              src={user?.profile_image_url || "https://xsgames.co/randomusers/avatar.php?g=pixel"}
              alt="Profile picture"
              className="size-32 md:size-48 overflow-hidden rounded-full object-cover bg-white border border-accentBG"
              onError={(event) => {
                event.currentTarget.src = "https://xsgames.co/randomusers/avatar.php?g=pixel";
              }}
            />
            <button
              type="button"
              aria-label="Edit profile picture"
              onClick={() => setIsProfilePicModalOpen(true)}
              className="absolute bottom-1 right-1 rounded-full bg-accent p-2 md:p-3 text-white shadow-lg"
            >
              <MdEdit className="size-5 md:size-6" />
            </button>
          </div>
        )}

        <div className="flex flex-col justify-center gap-1 md:gap-2 mt-2 md:mt-0">
          {showInitialSkeletons ? (
            <>
              <SkeletonBlock className="h-10 md:h-12 w-48 md:w-64" />
              <SkeletonBlock className="h-6 md:h-8 w-24 md:w-36" />
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-5xl font-medium tracking-wide text-primary">{user?.name}</h1>
              <p className="text-textsecondary text-sm md:text-2xl tracking-wide">
                {getXpTitle(user?.total_xp ?? 0)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Email + Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-10">
        <div className="bg-accentBG flex items-center gap-3 px-6 py-4 md:py-4 rounded-full">
          <MdEmail className="size-6 md:size-8 text-textsecondary" />
          <input
            type="text"
            value={showInitialSkeletons ? "" : user?.email ?? ""}
            readOnly
            className="bg-transparent outline-none text-base md:text-xl w-full text-textmain"
          />
        </div>

        <div className="bg-accentBG flex items-center gap-3 px-6 pr-3 py-2 md:py-2 rounded-full">
          <MdLock className="size-6 md:size-8 text-textsecondary" />
          <input
            type={showPassword ? "text" : "password"}
            value={showPassword ? "••••••••••••" : "************"}
            readOnly
            className="bg-transparent outline-none w-full text-base md:text-xl text-textsecondary"
          />
          <VscEyeClosed
            className="size-6 md:size-8 text-textsecondary cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
          <div className="rounded-full bg-accent flex items-center justify-center w-10 h-10 md:w-12 md:h-12 px-2 md:px-3 cursor-pointer shrink-0">
            <MdEdit className="text-white size-5 md:size-7" />
          </div>
        </div>
      </div>

      {/* Linked Account + Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-4 md:gap-6 mt-8 md:mt-10">
        <div className="bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] p-6 rounded-2xl sm:col-span-2 xl:col-span-3 relative h-[160px] md:h-auto">
          {showInitialSkeletons ? (
            <>
              <SkeletonBlock className="h-6 w-36" />
              <SkeletonBlock className="h-6 w-28 mt-2" />
            </>
          ) : (
            <div>
              <p className="text-gray-300 tracking-widest text-lg">
                {isBankLinked ? "XXXX XXXX 1234" : "Link Account"}
              </p>
              <p className="text-primary font-medium mt-1 text-lg">
                {isBankLinked ? user?.name : "No username"}
              </p>
            </div>
          )}

          {showInitialSkeletons ? (
            <SkeletonBlock className="absolute bottom-6 right-6 h-10 w-36 rounded-full" />
          ) : isBankLinked ? (
            <button
              onClick={openUnlinkAccountConfirmation}
              disabled={unlinkMutation.isPending}
              className="absolute bottom-5 right-5 text-sm md:text-base px-4 py-2 rounded-full transition border border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              Unlink Account
            </button>
          ) : (
            <button className="absolute bottom-5 right-5 text-sm md:text-base px-4 py-2 rounded-full transition border border-accent text-accent hover:bg-accent hover:text-white disabled:opacity-50 cursor-pointer">
              Link Account
            </button>
          )}
        </div>

        <div className="hidden sm:block col-span-1 xl:col-span-2">
          {showInitialSkeletons ? (
            <SkeletonBlock className="h-[152px] rounded-2xl" />
          ) : (
            <StatCard type="expense" value={86.85} />
          )}
        </div>

        <div className="hidden sm:block col-span-1 xl:col-span-2">
          {showInitialSkeletons ? (
            <SkeletonBlock className="h-[152px] rounded-2xl" />
          ) : (
            <StatCard type="income" value={86.85} />
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="flex items-center justify-between mt-10">
        <h2 className="text-2xl font-medium tracking-wide">Achievements</h2>
        <Link
          href="/achievements"
          className="text-primary text-lg hover:underline"
        >
          view all
        </Link>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 md:gap-6 mt-4">
        {rewardsLoading && !myRewards &&
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-[180px] md:h-[200px] rounded-4xl" />
          ))}

        {!rewardsLoading && myRewards?.map((ur) => (
          <AchievementCard
            key={ur.id}
            title={`${ur.reward.name} ${ur.reward.tier}`}
            subtitle={`${ur.reward.requirement_value}`}
            reward_type={`${ur.reward.reward_type}`}
          />
        ))}

        {!rewardsLoading && myRewards?.length === 0 && (
          <p className="text-gray-400 col-span-2 md:col-span-6">
            No achievements unlocked yet.
          </p>
        )}
      </div>

      {/* Account Actions */}
      <div className="mt-12 flex flex-col items-start gap-4 pb-8">
        <Button
          type="link"
          onClick={toggleTheme}
          className="md:hidden !text-[#ffaa2d] no-underline !text-lg !flex !flex-row !items-center !justify-start !px-0"
        >
          {theme === "dark" ? (
            <MdLightMode className="w-6 h-6 mr-2 text-primary" />
          ) : (
            <MdDarkMode className="w-6 h-6 mr-2 text-primary" />
          )}
          Toggle Theme
        </Button>

        <Button
          type="link"
          href="/help"
          className="!text-[#1890ff] no-underline !text-lg md:!text-xl !flex !flex-row !items-center !justify-start !px-0"
        >
          <IoHelpCircleOutline className="w-6 h-6 md:w-8 md:h-8 mr-2" />
          Help & Support
        </Button>

        <Button
          type="link"
          loading={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
          className="!text-red-500 no-underline !text-lg md:!text-xl !flex !flex-row !items-center !justify-start !px-0"
        >
          <IoLogOutOutline className="w-6 h-6 md:w-8 md:h-8 mr-2" />
          Logout
        </Button>

        <Button
          type="link"
          loading={deleteDataMutation.isPending}
          onClick={openDeleteDataConfirmation}
          className="!text-red-500 no-underline !text-lg md:!text-xl !flex !flex-row !items-center !justify-start !px-0"
        >
          <PiWarningFill className="w-6 h-6 md:w-8 md:h-8 mr-2" />
          Delete data
        </Button>
      </div>

      {/* Text Confirmation Overlay for Unlink Account */}
      <TextConfirmationOverlay
        title="Unlink Account?"
        confirmationText="unlink account"
        isOpen={isUnlinkAccountConfirmationOpen}
        onConfirm={handleUnlink}
        onCancel={closeUnlinkAccountConfirmation}
      />

      {/* Text Confirmation Overlay for Delete Data */}
      <TextConfirmationOverlay
        title="Delete Data?"
        confirmationText="delete data"
        isOpen={isDeleteDataConfirmationOpen}
        onConfirm={handleDeleteData}
        onCancel={closeDeleteDataConfirmation}
      />

      <Modal
        title="Update Profile Picture"
        open={isProfilePicModalOpen}
        rootClassName={PROFILE_PIC_UPLOAD_MODAL_CLASS}
        classNames={{
          mask: PROFILE_PIC_MASK_Z_INDEX_CLASS,
          wrapper: PROFILE_PIC_MASK_Z_INDEX_CLASS,
        }}
        onCancel={() => {
          setIsProfilePicModalOpen(false);
          setFileList([]);
        }}
        footer={[
          <Button
            key="reset"
            danger
            onClick={handleProfilePicReset}
            loading={resetProfilePictureMutation.isPending}
            disabled={changeProfilePictureMutation.isPending}
          >
            Reset
          </Button>,
          <Button
            key="cancel"
            onClick={() => {
              setIsProfilePicModalOpen(false);
              setFileList([]);
            }}
            disabled={
              changeProfilePictureMutation.isPending ||
              resetProfilePictureMutation.isPending
            }
          >
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleProfilePicUpload}
            loading={changeProfilePictureMutation.isPending}
            disabled={
              resetProfilePictureMutation.isPending ||
              fileList.length === 0
            }
          >
            Upload
          </Button>,
        ]}
      >
        <p className="mb-3 text-sm text-textsecondary">
          Select an image, crop it, and upload it as your profile picture.
        </p>
        <ImgCrop
          quality={1}
          modalProps={{
            rootClassName: PROFILE_PIC_CROP_MODAL_CLASS,
            classNames: {
              mask: PROFILE_PIC_MASK_Z_INDEX_CLASS,
              wrapper: PROFILE_PIC_MASK_Z_INDEX_CLASS,
            },
          }}
        >
          <Upload className="profile-pic-upload" listType="picture-card" {...uploadProps}>
            {fileList.length >= 1 ? null : <div className="text-textmain">+ Upload</div>}
          </Upload>
        </ImgCrop>
      </Modal>

      <LoadingOverlay show={showLoadingOverlay} />
    </div>
  );
}
