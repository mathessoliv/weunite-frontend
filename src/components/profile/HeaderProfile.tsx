import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ImageUp, Pencil } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import EditProfile from "./EditProfile";
import EditBanner from "./EditBanner";
import { useState } from "react";
import Following from "./Following";
import Followers from "./Followers";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useFollowAction } from "@/hooks/useFollowAction";
import { useGetFollowers, useGetFollowing } from "@/state/useFollow";
import { getInitials } from "@/utils/getInitials";
import { useTheme } from "../ThemeProvider";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface HeaderProfileProps {
  profileUsername?: string;
}

export default function HeaderProfile({ profileUsername }: HeaderProfileProps) {
  const { theme } = useTheme();

  const { user } = useAuthStore();
  const { data: profileUser } = useUserProfile(profileUsername);

  const isOwnProfile = !profileUsername || profileUsername === user?.username;
  const displayUser = isOwnProfile ? user : profileUser;

  const { data: followersData } = useGetFollowers(Number(displayUser?.id));
  const { data: followingData } = useGetFollowing(Number(displayUser?.id));

  const followersCount =
    followersData?.success && followersData?.data?.data
      ? followersData.data.data.length
      : 0;

  const followingCount =
    followingData?.success && followingData?.data?.data
      ? followingData.data.data.length
      : 0;

  const {
    isFollowing,
    handleFollow,
    isLoading: isFollowLoading,
  } = useFollowAction(profileUsername);

  const renderFollowButton = () => (
    <Button
      variant="outline"
      onClick={handleFollow}
      className="px-3 py-2 text-sm"
      disabled={isFollowLoading}
    >
      {isFollowing ? "Deixar de seguir" : "Seguir"}
    </Button>
  );

  const initials = getInitials(displayUser?.name);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [showUsernameTooltip, setShowUsernameTooltip] = useState(false);

  const handleEditProfileOpen = () => {
    setIsEditProfileOpen(true);
  };
  const handleFollowingOpen = () => {
    setIsFollowingOpen(true);
  };

  const handleFollowersOpen = () => {
    setIsFollowersOpen(true);
  };

  const handleBannerEdit = () => {
    setIsEditBannerOpen(true);
  };

  const getDefaultBanner = () => {
    if (isOwnProfile) {
      return theme === "light" ? "/BannerWhite.png" : "/BannerBlack.png";
    }
    return theme === "light" ? "/BannerBlackP.png" : "/BannerWhiteP.png";
  };
  const { isDesktop } = useBreakpoints();

  const truncatedUsername =
    !isDesktop &&
    !isOwnProfile &&
    displayUser?.username &&
    displayUser.username.length > 7
      ? displayUser.username.substring(0, 7) + "..."
      : displayUser?.username;

  if (isDesktop) {
    return (
      <>
        {isOwnProfile && (
          <EditProfile
            isOpen={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
          />
        )}

        {isOwnProfile && (
          <EditBanner
            isOpen={isEditBannerOpen}
            onOpenChange={setIsEditBannerOpen}
          />
        )}

        <Followers
          isOpen={isFollowersOpen}
          onOpenChange={setIsFollowersOpen}
          userId={Number(displayUser?.id)}
        />
        <Following
          isOpen={isFollowingOpen}
          onOpenChange={setIsFollowingOpen}
          userId={Number(displayUser?.id)}
        />

        <div className="w-[48em] mx-auto px-4">
          <div className="h-40 relative group ">
            <img
              className="w-full h-full object-cover rounded-b-sm"
              src={displayUser?.bannerImg || getDefaultBanner()}
            />
            {isOwnProfile && (
              <>
                <ImageUp
                  className="absolute right-6 text-primary top-31 hover:cursor-pointer hover:scale-110 transition-transform z-10"
                  onClick={handleBannerEdit}
                />

                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={handleBannerEdit}
                />
              </>
            )}
          </div>

          <div className="flex flex-col w-full">
            <div className="flex w-full">
              <div className="relative flex ml-[0.8em]">
                <Avatar
                  className="w-27 h-27 rounded-full border-5 border-background mt-[-50px] bg-background"
                  onClick={handleEditProfileOpen}
                >
                  <AvatarImage
                    src={displayUser?.profileImg}
                    alt="Foto de perfil"
                    className="w-full h-full rounded-full object-cover hover:cursor-pointer"
                  />
                  <AvatarFallback className="w-full h-full flex items-center border-1 border-primary rounded-full justify-center text-primary text-5xl ">
                    {initials}
                  </AvatarFallback>
                  {isOwnProfile && (
                    <div className="absolute bottom-2 right-0 bg-background rounded-full p-1 border border-primary shadow-sm">
                      <Pencil className="h-4 w-4 text-primary cursor-pointer rotate-90" />
                    </div>
                  )}
                </Avatar>
              </div>

              <div className="flex flex-col ml-[0.5em]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-primary font-medium text-2xl">
                      {truncatedUsername}
                    </p>
                  </TooltipTrigger>
                </Tooltip>
                <p className="text-[#a1a1a1] text-xs">{displayUser?.name}</p>
              </div>

              <div className="ml-auto mr-4 mt-2 gap-3 flex">
                {isOwnProfile ? (
                  <Button variant="outline" className="flex items-center gap-2">
                    Configurações
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    {renderFollowButton()}
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Conversar
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row w-full pl-5 mt-1 gap-3 text-primary text-sm ">
              <div
                className="flex flex-row items-center gap-1"
                onClick={handleFollowingOpen}
              >
                <span className="hover:cursor-pointer">{followingCount}</span>
                <span className="hover:cursor-pointer">Seguindo</span>
              </div>

              <div
                className="flex flex-row items-center gap-1"
                onClick={handleFollowersOpen}
              >
                <span className="hover:cursor-pointer">{followersCount}</span>
                <span className="hover:cursor-pointer">Seguidores</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOwnProfile && (
        <EditProfile
          isOpen={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
        />
      )}

      {isOwnProfile && (
        <EditBanner
          isOpen={isEditBannerOpen}
          onOpenChange={setIsEditBannerOpen}
        />
      )}

      <Followers
        isOpen={isFollowersOpen}
        onOpenChange={setIsFollowersOpen}
        userId={Number(displayUser?.id)}
      />
      <Following
        isOpen={isFollowingOpen}
        onOpenChange={setIsFollowingOpen}
        userId={Number(displayUser?.id)}
      />

      <div className="w-full md:max-w-[77vw] mx-auto">
        <div className="h-35 relative group">
          <img
            className="h-full w-full object-cover"
            src={displayUser?.bannerImg || getDefaultBanner()}
            alt="Banner do perfil"
          />
          {isOwnProfile && (
            <>
              <ImageUp
                className="absolute right-6 text-primary top-28 hover:cursor-pointer hover:scale-110 transition-transform z-10"
                onClick={handleBannerEdit}
              />

              <div
                className="absolute inset-0 cursor-pointer"
                onClick={handleBannerEdit}
              />
            </>
          )}
        </div>

        <div className="flex flex-col w-full">
          <div className="flex w-full">
            <div className="relative flex ml-[0.8em]">
              <Avatar
                className="w-27 h-27 rounded-full border-5 border-background mt-[-50px] bg-background"
                onClick={handleEditProfileOpen}
              >
                <AvatarImage
                  src={displayUser?.profileImg}
                  alt="Foto de perfil"
                  className="w-full h-full rounded-full object-cover hover:cursor-pointer"
                />
                <AvatarFallback className="w-full h-full flex items-center border-1 border-primary rounded-full justify-center text-primary text-5xl ">
                  {initials}
                </AvatarFallback>

                {isOwnProfile && (
                  <div className="absolute bottom-2 right-0 bg-background rounded-full p-1 border border-primary shadow-sm">
                    <Pencil className="h-4 w-4 text-primary cursor-pointer rotate-90" />
                  </div>
                )}
              </Avatar>
            </div>

            <div className="flex flex-col ml-[0.5em]">
              <Tooltip
                open={showUsernameTooltip}
                onOpenChange={setShowUsernameTooltip}
              >
                <TooltipTrigger asChild>
                  <p
                    className="text-primary text-base cursor-pointer"
                    onClick={() => setShowUsernameTooltip(!showUsernameTooltip)}
                  >
                    {truncatedUsername}
                  </p>
                </TooltipTrigger>
                {!isDesktop &&
                  !isOwnProfile &&
                  displayUser?.username &&
                  displayUser.username.length > 7 && (
                    <TooltipContent
                      side="bottom"
                      className="bg-background/80 text-primary text-xs border border-primary/20"
                    >
                      {displayUser.username}
                    </TooltipContent>
                  )}
              </Tooltip>
              <p className="text-[#a1a1a1] text-xs">{displayUser?.name}</p>
            </div>

            <div className="ml-auto mr-4 mt-2 gap-3 flex">
              {isOwnProfile ? (
                <Button variant="outline" className="flex items-center gap-2">
                  Configurações
                </Button>
              ) : (
                <div className="flex gap-3">
                  {renderFollowButton()}
                  <Button variant="outline" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Conversar
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row w-full pl-5 mt-1 gap-3 text-primary text-sm ">
            <div
              className="flex flex-row items-center gap-1"
              onClick={handleFollowingOpen}
            >
              <span className="hover:cursor-pointer">{followingCount}</span>
              <span className="hover:cursor-pointer">Seguindo</span>
            </div>

            <div
              className="flex flex-row items-center gap-1"
              onClick={handleFollowersOpen}
            >
              <span className="hover:cursor-pointer">{followersCount}</span>
              <span className="hover:cursor-pointer">Seguidores</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
