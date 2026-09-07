import React from "react";
import { 
  Home, 
  HelpCircle, 
  FileText, 
  Compass, 
  Bot, 
  Award, 
  Sun, 
  Moon, 
  BookOpen,
  Sparkles
} from "lucide-react";

export type ActiveTabType = 
  | "dashboard" 
  | "quiz-hub" 
  | "worksheets" 
  | "map-explorer" 
  | "chat" 
  | "badges" 
  | "gallery";

interface NavigationDockProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  unreadChatCount?: number;
  themeMode: "light" | "sepia";
  onCycleTheme: () => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeTab,
  setActiveTab,
  unreadChatCount = 0,
  themeMode,
  onCycleTheme,
}) => {
  const navItems = [
    {
      id: "dashboard" as ActiveTabType,
      label: "الرئيسية",
      icon: Home,
      color: "text-amber-600",
      activeBg: "bg-amber-100 border-amber-400 text-amber-900 font-bold",
    },
    {
      id: "quiz-hub" as ActiveTabType,
      label: "التحديات",
      icon: HelpCircle,
      color: "text-emerald-600",
      activeBg: "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold",
    },
    {
      id: "map-explorer" as ActiveTabType,
      label: "الخريطة",
      icon: Compass,
      color: "text-sky-600",
      activeBg: "bg-sky-100 border-sky-400 text-sky-900 font-bold",
    },
    {
      id: "worksheets" as ActiveTabType,
      label: "الأوراق",
      icon: FileText,
      color: "text-purple-600",
      activeBg: "bg-purple-100 border-purple-400 text-purple-900 font-bold",
    },
    {
      id: "chat" as ActiveTabType,
      label: "المعلم",
      icon: Bot,
      color: "text-cyan-600",
      activeBg: "bg-cyan-100 border-cyan-400 text-cyan-900 font-bold",
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      id: "badges" as ActiveTabType,
      label: "الأوسمة",
      icon: Award,
      color: "text-amber-600",
      activeBg: "bg-amber-100 border-amber-400 text-amber-900 font-bold",
    },
  ];

  const getThemeIcon = () => {
    if (themeMode === "light") return <Sun className="w-5 h-5 text-amber-600" />;
    return <BookOpen className="w-5 h-5 text-amber-800" />;
  };

  const getThemeLabel = () => {
    if (themeMode === "light") return "مشرق";
    return "ورق سيبيا";
  };

  return (
    <nav 
      id="mobile-bottom-dock" 
      aria-label="شريط التنقل السفلي السريع"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-amber-200/90 px-2 py-1.5 shadow-2xl safe-area-bottom transition-colors duration-200"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? `${item.activeBg} border shadow-sm scale-105` 
                  : "text-slate-600 hover:text-slate-900 active:scale-95"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "" : item.color}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.2 shadow animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Theme mode toggle quick button */}
        <button
          onClick={onCycleTheme}
          title={`النمط الحالي: ${getThemeLabel()} - انقر للتبديل`}
          className="flex flex-col items-center justify-center min-w-[44px] py-1 px-1.5 rounded-xl text-slate-600 hover:text-amber-700 transition-all active:scale-90 cursor-pointer"
        >
          {getThemeIcon()}
          <span className="text-[9px] mt-0.5 font-medium opacity-80">
            {getThemeLabel()}
          </span>
        </button>
      </div>
    </nav>
  );
};
