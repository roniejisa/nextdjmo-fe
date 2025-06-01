"use client";

import { useRef, useState } from "react";
import { redirect } from "next/navigation";
import LinkCustom from "@/packages/translation/Link";
import MenuProfile from "./MenuProfile";
import { showImageUrl } from "@/utils/client";
import ImageCustom from "@/components/Maintain/Image";

// User avatar component
const UserAvatar = ({
  avatar,
  username,
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
}) => {
  const avatarClasses = `
    relative w-12 h-12 rounded-full overflow-hidden
    ring-2 ring-white shadow-lg
    transition-all duration-200 ease-in-out
    hover:ring-blue-200 hover:shadow-xl hover:scale-105
  `;

  return (
    <div className={avatarClasses}>
      <ImageCustom
        src={showImageUrl(avatar)}
        alt={`${username}'s avatar`}
        fill={true}
        className="object-cover"
        style={{ borderRadius: "50%" }}
        onMouseEnter={isCollapsed ? onMouseEnter : undefined}
        onMouseLeave={isCollapsed ? onMouseLeave : undefined}
      />
    </div>
  );
};

// User info component for expanded state
const UserInfo = ({ username, email }) => (
  <div className="flex flex-col justify-center min-w-0 flex-1">
    <div className="font-medium text-gray-900 truncate">@{username}</div>
    <div className="text-xs text-gray-500 truncate">{email}</div>
  </div>
);

// Profile link component
const ProfileLink = ({
  userId,
  avatar,
  username,
  email,
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
}) => {
  const linkClasses = `
    flex items-center gap-3 p-1 rounded-lg
    transition-all duration-200 ease-in-out
    hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${isCollapsed ? "justify-center" : "flex-1"}
  `;

  return (
    <LinkCustom
      href={`${process.env.NEXT_PUBLIC_ADMIN_URL}customers/${userId}`}
      className={linkClasses}
      title={`View ${username}'s profile`}
    >
      <UserAvatar
        avatar={avatar}
        username={username}
        isCollapsed={isCollapsed}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      {!isCollapsed && <UserInfo username={username} email={email} />}
    </LinkCustom>
  );
};

// Main container component
const ProfileContainer = ({ isCollapsed, children }) => {
  const containerClasses = `
    p-3 rounded-xl bg-gradient-to-br from-white to-gray-50
    border border-gray-100 shadow-sm
    transition-all duration-300 ease-in-out
    hover:shadow-md hover:from-gray-50 hover:to-white
  `;

  const contentClasses = `
    flex items-center relative
    ${isCollapsed ? "justify-center" : "gap-2"}
  `;

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>{children}</div>
    </div>
  );
};

// Custom hook for menu state management
const useMenuState = () => {
  const [showMenu, setShowMenu] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    // Add 300ms delay before hiding menu for better UX
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 300);
  };

  // Cleanup timeout on unmount
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return {
    showMenu,
    handleMouseEnter,
    handleMouseLeave,
    cleanup,
  };
};

// Main component
const SidebarProfile = ({ profile, isCollapsed }) => {
  // Early return with redirect if no profile
  if (!profile) {
    redirect("/");
    return null;
  }

  const {
    user: { avatar, email, username, _id: userId },
  } = profile;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { showMenu, handleMouseEnter, handleMouseLeave } = useMenuState();

  return (
    <ProfileContainer isCollapsed={isCollapsed}>
      <ProfileLink
        userId={userId}
        avatar={avatar}
        username={username}
        email={email}
        isCollapsed={isCollapsed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <MenuProfile
        id={userId}
        username={username}
        email={email}
        isCollapsed={isCollapsed}
        showMenu={showMenu}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </ProfileContainer>
  );
};

export default SidebarProfile;
