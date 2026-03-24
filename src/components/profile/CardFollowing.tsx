import { getInitials } from "@/utils/getInitials";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import type { User } from "@/@types/user.types";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useGetFollow, useFollowAndUnfollow } from "@/state/useFollow";

interface CardFollowingProps {
  user: User;
  onUserClick?: () => void;
}

export default function CardFollowing({
  user,
  onUserClick,
}: CardFollowingProps) {
  const initials = getInitials(user?.name);
  const { user: currentUser } = useAuthStore();

  const followerId = currentUser?.id ? Number(currentUser.id) : 0;
  const followedId = user?.id ? Number(user.id) : 0;

  const { data: followData, isLoading } = useGetFollow(followerId, followedId);
  const { mutate: followAndUnfollow, isPending } = useFollowAndUnfollow();

  const isFollowing = followData?.success && followData?.data;
  const isMe = followerId === followedId;

  const handleFollowToggle = () => {
    if (!currentUser) return;
    followAndUnfollow({ followerId, followedId });
  };

  return (
    <CardContent className="flex mt-5">
      <Link
        to={`/profile/${user?.username}`}
        className="flex gap-2 items-center flex-1 hover:opacity-80 transition-opacity"
        onClick={onUserClick}
      >
        <Avatar className="w-13 h-13 rounded-full">
          <AvatarImage
            src={user?.profileImg}
            alt="Foto de perfil"
            className="w-full h-full rounded-full object-cover hover:cursor-pointer"
          />
          <AvatarFallback className="w-full h-full flex items-center border-1 border-primary rounded-full justify-center text-primary text-2xl ">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col  items-start justify-center">
          <p className="text-primary font-medium">{user?.username}</p>
          <p className="text-[#a1a1a1] text-xs">{user?.name}</p>
        </div>
      </Link>
      {!isMe && currentUser && (
        <div className="ml-auto flex items-center">
          <Button
            variant={isFollowing ? "outline" : "default"}
            className="text-xs font-normal"
            onClick={handleFollowToggle}
            disabled={isPending || isLoading}
          >
            {isFollowing ? "Deixar de seguir" : "Seguir"}
          </Button>
        </div>
      )}
    </CardContent>
  );
}
