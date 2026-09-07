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
  themeMode: "dark" | "light" | "sepia";
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
      color: "text-amber-600 dark:text-amber-400",
      activeBg: "bg-amber-500/20 border-amber-500/50 text-amber-900 dark:text-amber-300 font-bold",
    },
    {
      id: "quiz-hub" as ActiveTabType,
      label: "التحديات",
      icon: HelpCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      activeBg: "bg-emerald-500/20 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 font-bold",
    },
    {
      id: "map-explorer" as ActiveTabType,
      label: "الخريطة",
      icon: Compass,
      color: "text-sky-600 dark:text-sky-400",
      activeBg: "bg-sky-500/20 border-sky-500/50 text-sky-900 dark:text-sky-300 font-bold",
    },
    {
      id: "worksheets" as ActiveTabType,
      label: "الأوراق",
      icon: FileText,
      color: "text-purple-600 dark:text-purple-400",
      activeBg: "bg-purple-500/20 border-purple-500/50 text-purple-900 dark:text-purple-300 font-bold",
    },
    {
      id: "chat" as ActiveTabType,
      label: "المعلم",
      icon: Bot,
      color: "text-cyan-600 dark:text-cyan-400",
      activeBg: "bg-cyan-500/20 border-cyan-500/50 text-cyan-900 dark:text-cyan-300 font-bold",
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      id: "badges" as ActiveTabType,
      label: "الأوسمة",
      icon: Award,
      color: "text-amber-600 dark:text-yellow-400",
      activeBg: "bg-amber-500/20 border-amber-500/50 text-amber-900 dark:text-yellow-300 font-bold",
    },
  ];

  const getThemeIcon = () => {
    if (themeMode === "dark") return <Moon className="w-5 h-5 text-indigo-400" />;
    if (themeMode === "light") return <Sun className="w-5 h-5 text-amber-500" />;
    return <BookOpen className="w-5 h-5 text-amber-700" />;
  };

  const getThemeLabel = () => {
    if (themeMode === "dark") return "ليلي";
    if (themeMode === "light") return "نهاري";
    return "سيبيا مريح";
  };

  return (
    <nav 
      id="mobile-bottom-dock" 
      aria-label="شريط التنقل السفلي السريع"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121020]/95 backdrop-blur-lg border-t border-slate-200 dark:border-indigo-900/60 px-2 py-1.5 shadow-2xl safe-area-bottom transition-colors duration-200"
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
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95"
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
          className="flex flex-col items-center justify-center min-w-[44px] py-1 px-1.5 rounded-xl text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-all active:scale-90 cursor-pointer"
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
