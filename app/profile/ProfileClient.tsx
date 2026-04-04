"use client";

import React, { useEffect, useState } from "react";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";
import axios from "axios";

// react-icons
import { MdEmail, MdLock, MdEdit } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";
import { PiWarningFill } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";
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
      <div className="flex gap-8 items-center">
        {showInitialSkeletons ? (
          <SkeletonBlock className="size-48 rounded-full" />
        ) : (
          <div className="relative size-48">
            <img
              src={user?.profile_image_url || "https://xsgames.co/randomusers/avatar.php?g=pixel"}
              alt="Profile picture"
              className="size-48 overflow-hidden rounded-full object-cover bg-white border border-accentBG"
              onError={(event) => {
                event.currentTarget.src = "https://xsgames.co/randomusers/avatar.php?g=pixel";
              }}
            />
            <button
              type="button"
              aria-label="Edit profile picture"
              onClick={() => setIsProfilePicModalOpen(true)}
              className="absolute bottom-1 right-1 rounded-full bg-accent p-3 text-white shadow-lg"
            >
              <MdEdit className="size-6" />
            </button>
          </div>
        )}

        <div className="flex flex-col justify-center gap-2">
          {showInitialSkeletons ? (
            <>
              <SkeletonBlock className="h-12 w-64" />
              <SkeletonBlock className="h-8 w-36" />
            </>
          ) : (
            <>
              <h1 className="text-5xl font-medium tracking-wide">{user?.name}</h1>
              <p className="text-gray-200 text-2xl tracking-wide">
                {getXpTitle(user?.total_xp ?? 0)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Email + Password */}
      <div className="grid grid-cols-5 gap-6 mt-10">
        <div className="bg-accentBG flex items-center gap-3 px-6 py-4 rounded-full col-span-2">
          <MdEmail className="size-8" />
          <input
            type="text"
            value={showInitialSkeletons ? "" : user?.email ?? ""}
            readOnly
            className="bg-transparent outline-none text-xl w-full"
          />
        </div>

        <div className="bg-accentBG flex items-center gap-3 px-6 pr-3 py-2 rounded-full col-span-2">
          <MdLock className="size-8" />
          <input
            type={showPassword ? "text" : "password"}
            value={showPassword ? "••••••••••••" : "************"}
            readOnly
            className="bg-transparent outline-none w-full text-xl"
          />
          <VscEyeClosed
            className="size-8 text-textmain cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
          <div className="rounded-full bg-accent flex items-center justify-center w-12 h-12 px-3 cursor-pointer">
            <MdEdit className="text-white size-7" />
          </div>
        </div>
      </div>

      {/* Linked Account + Stats */}
      <div className="grid grid-cols-7 gap-6 mt-10">
        <div className="bg-gradient-to-br from-[var(--color-bankCardFrom)] to-[var(--color-bankCardTo)] p-6 rounded-2xl col-span-3 relative">
          {showInitialSkeletons ? (
            <>
              <SkeletonBlock className="h-6 w-36" />
              <SkeletonBlock className="h-6 w-28 mt-2" />
            </>
          ) : (
            <div>
              <p className="text-gray-400 tracking-widest">
                {isBankLinked ? "XXXX XXXX 1234" : "Link Account"}
              </p>
              <p className="text-yellow-400 font-medium mt-1">
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
              className="absolute bottom-6 right-6 px-4 py-2 rounded-full transition border border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              Unlink Account
            </button>
          ) : (
            <button className="absolute bottom-6 right-6 px-4 py-2 rounded-full transition border border-accent text-accent hover:bg-accent hover:text-white disabled:opacity-50 cursor-pointer">
              Link Account
            </button>
          )}
        </div>

        <div className="col-span-2">
          {showInitialSkeletons ? (
            <SkeletonBlock className="h-[152px] rounded-2xl" />
          ) : (
            <StatCard type="expense" value={86.85} />
          )}
        </div>

        <div className="col-span-2">
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

      <div className="grid grid-cols-6 gap-6 mt-4 overflow-x-auto">
        {rewardsLoading && !myRewards &&
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-[200px] rounded-4xl" />
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
          <p className="text-gray-400 col-span-6">
            No achievements unlocked yet.
          </p>
        )}
      </div>

      {/* Account Actions */}
      <div className="mt-20 flex flex-col items-start gap-2">
        <Button
          type="link"
          loading={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
          className="!text-red-500 no-underline !text-2xl !flex !flex-row !items-center !justify-center !px-0"
        >
          <IoLogOutOutline className="w-8" />
          Logout
        </Button>

        <Button
          type="link"
          loading={deleteDataMutation.isPending}
          onClick={() => deleteDataMutation.mutate()}
          className="!text-red-500 no-underline !text-2xl !flex !flex-row !items-center !justify-center !px-0"
        >
          <PiWarningFill className="w-8" />
          Delete Data
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
