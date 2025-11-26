import {
  Home,
  Search as SearchIcon,
  Link,
  MessageCircleMore,
  DiamondPlus,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
  Shield,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { Search } from "@/components/shared/Search";
import { CreatePost } from "../post/CreatePost";
import { NotificationPanel } from "@/components/notification/NotificationPanel";
import { useTheme } from "@/components/ThemeProvider";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { getInitials } from "@/utils/getInitials";

import { useGetUnreadCount } from "@/state/useNotifications";
import { useWebSocket } from "@/contexts/WebSocketContext";

export function LeftSidebar() {
  const { state, setOpen } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const { logout } = useAuthStore();
  const { user } = useAuthStore();
  const initials = getInitials(user?.username);

  const userId = user?.id;
  const { subscribeToNotifications } = useWebSocket();

  const { data: unreadCountData } = useGetUnreadCount(Number(userId) || 0);
  const unreadCount = unreadCountData?.success
    ? unreadCountData.data?.unreadCount || 0
    : 0;

  const isAdmin = user?.role === "admin".toUpperCase();

  const { setTheme, theme } = useTheme();
  const themeIcon = theme === "dark" ? Sun : Moon;
  const location = useLocation();
  const pathname = location.pathname;
  const getIncoColor = (path: string): string =>
    pathname === path ? "#22C55E" : "currentColor";

  const navigate = useNavigate();

  const { isMobile, isSmallDesktop } = useBreakpoints();

  const previsDesktop = useRef(isSmallDesktop);

  const handleSearchOpen = () => {
    if (state === "expanded") {
      setOpen(false);
    }
    setIsNotificationsOpen(false); // Fecha notificações ao abrir pesquisa
    setIsSearchOpen(true);
  };

  const handleNotificationsOpen = () => {
    if (state === "expanded") {
      setOpen(false);
    }
    setIsSearchOpen(false); // Fecha pesquisa ao abrir notificações
    setIsNotificationsOpen(true);
  };

  const handleCreatePostOpen = () => {
    setIsCreatePostOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const themeItem = {
    title: "Modo de cor",
    url: "#",
    icon: themeIcon,
  };

  const items = [
    { title: "Home", url: "/home", icon: Home, color: getIncoColor("/home") },
    {
      title: "Oportunidade",
      url: "/opportunity",
      icon: Link,
      color: getIncoColor("/opportunity"),
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageCircleMore,
      color: getIncoColor("/chat"),
    },
    { title: "Pesquisar", url: "#", icon: SearchIcon },
    { title: "Notificações", url: "#", icon: Bell },
    { title: "Criar Publicação", url: "#", icon: DiamondPlus },
    themeItem,
  ];

  useEffect(() => {
    if (isSearchOpen && state === "expanded") {
      setOpen(false);
    }
  }, [isSearchOpen, state, setOpen]);

  // Subscribe to WebSocket notifications
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToNotifications(Number(userId));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, subscribeToNotifications]);

  useEffect(() => {
    if (isSmallDesktop && !previsDesktop.current) {
      setOpen(false);
    }

    previsDesktop.current = isSmallDesktop;
  }, [isSmallDesktop, setOpen]);

  const CustomSidebarTrigger = (
    props: React.ComponentProps<typeof SidebarTrigger>,
  ) => {
    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (isSearchOpen && state === "collapsed") {
        return;
      }
      props.onClick?.(e);
    };
    return <SidebarTrigger {...props} onClick={handleClick} />;
  };

  return (
    <>
      <Search isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <NotificationPanel
        isOpen={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
      <CreatePost open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />

      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div
            className={`
              ${state === "collapsed" ? "flex justify-center items-center" : "pt-4"}
              `}
          >
            {state === "collapsed" || isMobile ? (
              <div className="flex items-center justify-center w-full py-4 gap-2">
                <span className="font-bold text-xl text-primary">W</span>
                <CustomSidebarTrigger className="p-0 m-0" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span
                  className={`
                        font-bold transition-all duration-200  whitespace-nowrap max-w-xs opacity-100 text-xl ml-2 
                      `}
                  style={{
                    transition: "all 0.2s",
                  }}
                >
                  <span className="text-primary ">We</span>
                  <span className="text-third">Unite</span>
                </span>
                <CustomSidebarTrigger />
              </div>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel
              className={state === "collapsed" ? "text-center" : ""}
            >
              {state !== "collapsed" && !isMobile && "Navegação"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu
                className={
                  state === "collapsed" || isMobile
                    ? "flex flex-col items-center gap-6"
                    : "gap-4"
                }
              >
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={
                      state === "collapsed"
                        ? "w-full flex justify-center mb-2"
                        : "mb-2"
                    }
                  >
                    <SidebarMenuButton
                      tooltip={state === "collapsed" ? item.title : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.title === "Modo de cor") {
                          setTheme(theme === "dark" ? "light" : "dark");
                        } else if (item.title === "Pesquisar") {
                          handleSearchOpen();
                        } else if (item.title === "Notificações") {
                          handleNotificationsOpen();
                        } else if (item.title === "Criar Publicação") {
                          handleCreatePostOpen();
                        } else if (item.url !== "#") {
                          navigate(item.url);
                        }
                      }}
                      className={`flex cursor-pointer ${
                        state === "collapsed"
                          ? "justify-center w-full py-2"
                          : "items-center gap-2"
                      }`}
                      data-tour={
                        item.title === "Home"
                          ? "home"
                          : item.title === "Oportunidade"
                            ? "opportunities"
                            : item.title === "Chat"
                              ? "messages"
                              : item.title === "Criar Publicação"
                                ? "create-post"
                                : undefined
                      }
                    >
                      <div
                        className={`relative ${
                          state === "collapsed" ? "flex justify-center" : ""
                        }`}
                      >
                        <item.icon
                          style={{
                            width: "24px",
                            height: "24px",
                            color:
                              item.url !== "#" && pathname === item.url
                                ? "#22C55E"
                                : "currentColor",
                          }}
                        />
                        {item.title === "Notificações" && unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </div>
                      {state !== "collapsed" && (
                        <span
                          className={
                            item.url !== "#" && pathname === item.url
                              ? "text-[#22C55E]"
                              : ""
                          }
                        >
                          {item.title}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="mb-3">
            <SidebarMenuItem
              className={
                state === "collapsed" || isMobile
                  ? "w-full flex justify-center"
                  : ""
              }
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hover:cursor-pointer">
                  <SidebarMenuButton
                    className={`flex ${
                      state === "collapsed"
                        ? "justify-center w-full "
                        : "items-center gap-2 "
                    }`}
                  >
                    <Avatar className={state === "collapsed" ? "mx-auto" : ""}>
                      <AvatarImage src={user?.profileImg} alt="@shadcn" />
                      <AvatarFallback> {initials}</AvatarFallback>
                    </Avatar>
                    {state !== "collapsed" && <p>{user?.username}</p>}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={state === "collapsed" ? "top" : "top"}
                  align={state === "collapsed" ? "start" : "center"}
                  alignOffset={state === "collapsed" ? 8 : 0}
                  sideOffset={state === "collapsed" ? 8 : 6}
                  className="w-56 p-2 border rounded-lg shadow-lg animate-in slide-in-from-bottom-5 duration-200"
                >
                  <div className="px-3 py-2 mb-1 border-b border-gray-100">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>

                  <div className="space-y-1 py-1">
                    <DropdownMenuItem
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => navigate("/profile")}
                      data-tour="profile"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      <p>Perfil</p>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <p>Configurações</p>
                    </DropdownMenuItem>
                  </div>

                  {isAdmin && (
                    <DropdownMenuItem
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-50 transition-colors text-blue-600"
                      onClick={() => {
                        console.log("Clicou no Painel Admin!", {
                          isAdmin,
                          userEmail: user?.email,
                        });
                        console.log("Navegando para /admin...");
                        navigate("/admin");
                        console.log("Navigate executado!");
                      }}
                    >
                      <Shield className="h-4 w-4 text-blue-500" />
                      <p>Painel Admin</p>
                    </DropdownMenuItem>
                  )}

                  <div className="h-px bg-gray-100 my-1"></div>
                  <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-red-400 hover:bg-red-50 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 -scale-x-100" />
                    <p>Sair</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
