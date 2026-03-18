"use client";

import React, { useEffect, useState } from "react";

// react-icons
import { MdEmail, MdLock, MdEdit } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";
import { PiWarningFill } from "react-icons/pi";

import StatCard from "@/components/gloabalComponents/StatCards";
import AchievementCard from "@/components/gloabalComponents/AchievementCard";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMyUnlockedRewards } from "@/hooks/useRewards";

import Link from "next/link";
import { Button } from "antd";
import {
  useDeleteUserTransactionData,
  useUnlinkBankAccounts,
} from "@/hooks/useBankTransaction";

import { useProfileOverlays } from "@/stores/useProfileOverlays";
import TextConfirmationOverlay from "@/components/gloabalComponents/TextConfirmationOverlay";

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

export default function Profile() {
  const [isLinked, setIsLinked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, isLoading, error } = useCurrentUser();
  const { data: myRewards, isLoading: rewardsLoading } = useMyUnlockedRewards();
  const showInitialSkeletons = isLoading && !user;
  const showLoadingOverlay = showInitialSkeletons || rewardsLoading;

  const unlinkMutation = useUnlinkBankAccounts();
  const deleteDataMutation = useDeleteUserTransactionData();

  const {
    isUnlinkAccountConfirmationOpen,
    openUnlinkAccountConfirmation,
    closeUnlinkAccountConfirmation,
  } = useProfileOverlays();

  // Sync UI with localStorage
  useEffect(() => {
    const linked = localStorage.getItem("isBankLinked") === "true";
    setIsLinked(linked);
  }, []);

  const handleUnlink = () => {
    unlinkMutation.mutate(undefined, {
      onSuccess: () => {
        setIsLinked(false);
        closeUnlinkAccountConfirmation();
      },
    });
  };

  return (
    <div className="p-6">
      {error && !showInitialSkeletons && (
        <p className="mb-6 text-red-500">Failed to load user</p>
      )}
      {/* Top Section */}
      <div className="flex gap-8 items-center">
        {showInitialSkeletons ? (
          <SkeletonBlock className="size-48 rounded-full bg-tableBG" />
        ) : (
          <div className="size-48 overflow-hidden rounded-full bg-white" />
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
            className="size-8 text-white cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
          <div className="rounded-full bg-accent flex items-center justify-center w-12 h-12 px-3 cursor-pointer">
            <MdEdit className="text-white size-7" />
          </div>
        </div>
      </div>

      {/* Linked Account + Stats */}
      <div className="grid grid-cols-7 gap-6 mt-10">
        <div className="bg-linear-to-br from-[#1b1b1b] to-[#0e0e0e] p-6 rounded-2xl col-span-3 relative">
          {showInitialSkeletons ? (
            <>
              <SkeletonBlock className="h-6 w-36" />
              <SkeletonBlock className="h-6 w-28 mt-2" />
            </>
          ) : (
            <div>
              <p className="text-gray-400 tracking-widest">
                {isLinked ? "XXXX XXXX 1234" : "Link Account"}
              </p>
              <p className="text-yellow-400 font-medium mt-1">
                {isLinked ? user?.name : "No username"}
              </p>
            </div>
          )}

          {showInitialSkeletons ? (
            <SkeletonBlock className="absolute bottom-6 right-6 h-10 w-36 rounded-full" />
          ) : isLinked ? (
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
            <SkeletonBlock className="h-[152px] rounded-2xl bg-secondaryBG" />
          ) : (
            <StatCard type="expense" value={86.85} />
          )}
        </div>

        <div className="col-span-2">
          {showInitialSkeletons ? (
            <SkeletonBlock className="h-[152px] rounded-2xl bg-secondaryBG" />
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
            <SkeletonBlock key={index} className="h-[200px] rounded-4xl bg-tableBG" />
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

      {/* Delete Data */}
      <div className="mt-20">
        <Button
          type="link"
          loading={deleteDataMutation.isPending}
          onClick={() => deleteDataMutation.mutate()}
          className="!text-red-500 no-underline !text-2xl !flex !flex-row !items-center !justify-center"
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

      <LoadingOverlay show={showLoadingOverlay} />
    </div>
  );
}
