/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import { HISTORIC_CITIES_FULL } from "../data";
import { HistoricCity } from "../types";
import { playSound } from "./SoundEffects";
import {
  MapPin,
  Award,
  Check,
  X,
  HelpCircle,
  Compass,
  Layers,
  RotateCcw,
  Search,
  BookOpen,
  Sparkles,
  Filter,
  CheckCircle2,
} from "lucide-react";

interface MapExplorerProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onUnlockBadge: (badgeId: string) => void;
}

// Map layer configuration using 100% free, watermark-free tile providers
const MAP_LAYERS = [
  {
    id: "osm",
    label: "الخريطة التعليمية القياسية",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: Compass,
  },
  {
    id: "hot",
    label: "الخريطة الإنسانية الدافئة",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by Humanitarian OpenStreetMap Team',
    icon: Layers,
  },
  {
    id: "satellite",
    label: "الأقمار الصناعية والتضاريس",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    icon: Layers,
  },
  {
    id: "topo",
    label: "خريطة المعالم الطبوغرافية",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
    icon: Layers,
  },
] as const;

type MapStyleId = (typeof MAP_LAYERS)[number]["id"];

const UNIT_FILTERS = [
  { id: 0, label: "جميع الوحدات (21 معلماً تاريخياً)", center: [20.0, 20.0] as [number, number], zoom: 3 },
  { id: 1, label: "الوحدة 1: الحكم التركي المصري للسودان", center: [15.5, 32.5] as [number, number], zoom: 6 },
  { id: 2, label: "الوحدة 2: تاريخ السودان الحديث والمعاصر", center: [15.0, 31.5] as [number, number], zoom: 6 },
  { id: 3, label: "الوحدة 3: تاريخ أوروبا الحديث", center: [46.0, 8.0] as [number, number], zoom: 4 },
  { id: 4, label: "الوحدة 4: التوسع الاستعماري والحروب العالمية", center: [48.0, 15.0] as [number, number], zoom: 4 },
];

export const MapExplorer: React.FC<MapExplorerProps> = ({ score, setScore, onUnlockBadge }) => {
  const [selectedCity, setSelectedCity] = useState<HistoricCity | null>(null);
  const [answeredCities, setAnsweredCities] = useState<Record<string, boolean>>({});
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);

  // Filter & Search states
  const [activeUnitFilter, setActiveUnitFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Map settings
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleId>("osm");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filter cities by active unit and search query
  const filteredCities = useMemo(() => {
    return HISTORIC_CITIES_FULL.filter((city) => {
      const matchUnit = activeUnitFilter === 0 || city.unitId === activeUnitFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchUnit;
      const matchSearch =
        city.name.toLowerCase().includes(q) ||
        city.historicalTitle.toLowerCase().includes(q) ||
        city.country.toLowerCase().includes(q) ||
        city.lessonTitle.toLowerCase().includes(q) ||
        city.description.toLowerCase().includes(q);
      return matchUnit && matchSearch;
    });
  }, [activeUnitFilter, searchQuery]);

  // Total solved count
  const solvedCount = Object.keys(answeredCities).filter((k) => answeredCities[k]).length;

  // Initialize Leaflet Map instance
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20.0, 20.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    leafletMapRef.current = map;
    setMapInstance(map);

    // Initial OSM Tile Layer (Watermark-free)
    const initialLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    tileLayerRef.current = initialLayer;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Tile Layer upon style change
  useEffect(() => {
    if (!mapInstance) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const currentLayerConfig = MAP_LAYERS.find((l) => l.id === mapStyle) || MAP_LAYERS[0];
    const newLayer = L.tileLayer(currentLayerConfig.url, {
      attribution: currentLayerConfig.attribution,
      maxZoom: 18,
    }).addTo(mapInstance);

    tileLayerRef.current = newLayer;
  }, [mapInstance, mapStyle]);

  // Handle City Selection
  const handleCitySelect = (city: HistoricCity) => {
    playSound("click");
    setSelectedCity(city);
    setUserAnswer(null);
    setQuizResult(null);

    if (leafletMapRef.current) {
      leafletMapRef.current.setView([city.lat, city.lng], 6, {
        animate: true,
        duration: 1.2,
      });
    }
  };

  // Switch Unit Filter & fly to regional centroid
  const handleUnitFilterChange = (filterId: number) => {
    playSound("click");
    setActiveUnitFilter(filterId);
    const filterObj = UNIT_FILTERS.find((f) => f.id === filterId);
    if (filterObj && leafletMapRef.current) {
      leafletMapRef.current.setView(filterObj.center, filterObj.zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  // Populate Interactive Leaflet Markers
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredCities.forEach((city) => {
      const isSelected = selectedCity?.id === city.id;
      const isSolved = answeredCities[city.name];

      // Color coding per unit
      const unitBadgeColors: Record<number, { bg: string; border: string; ring: string }> = {
        1: { bg: "bg-emerald-600", border: "border-emerald-300", ring: "ring-emerald-400/30" },
        2: { bg: "bg-indigo-600", border: "border-indigo-300", ring: "ring-indigo-400/30" },
        3: { bg: "bg-amber-600", border: "border-amber-300", ring: "ring-amber-400/30" },
        4: { bg: "bg-rose-600", border: "border-rose-300", ring: "ring-rose-400/30" },
        5: { bg: "bg-teal-600", border: "border-teal-300", ring: "ring-teal-400/30" },
      };

      const unitColor = unitBadgeColors[city.unitId] || { bg: "bg-amber-600", border: "border-amber-300", ring: "ring-amber-400/30" };

      const markerHTML = `
        <div class="relative flex items-center justify-center cursor-pointer select-none group" style="transform: translate(-18px, -18px); width: 36px; height: 36px;">
          ${!isSolved && !isSelected ? '<span class="absolute -inset-1 rounded-full bg-amber-500/40 opacity-75 animate-ping"></span>' : ""}
          
          <div class="w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-200 ${
            isSelected
              ? "bg-amber-500 border-white scale-125 ring-4 ring-amber-500/40 text-slate-950 font-black shadow-xl z-30"
              : isSolved
              ? "bg-emerald-600 border-emerald-200 text-white shadow-md z-10"
              : `${unitColor.bg} ${unitColor.border} text-white hover:scale-110 z-20`
          }">
            ${
              isSolved
                ? '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none" class="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                : isSelected
                ? '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" class="text-slate-950"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
                : `<span class="text-[11px] font-black leading-none">${city.unitId}</span>`
            }
          </div>
          
          <!-- Label pill -->
          <div class="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[11px] font-bold border shadow-md whitespace-nowrap transition-all pointer-events-none ${
            isSelected
              ? "bg-amber-500 border-amber-600 text-slate-950 scale-105 z-30 shadow-lg font-black"
              : isSolved
              ? "bg-emerald-800 text-white border-emerald-600 z-10 opacity-90"
              : "bg-white text-slate-900 border-amber-300 shadow z-20 group-hover:scale-105"
          }">
            ${city.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHTML,
        className: "custom-historic-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon })
        .addTo(mapInstance)
        .on("click", () => {
          handleCitySelect(city);
        });

      markersRef.current.push(marker);
    });
  }, [mapInstance, filteredCities, selectedCity, answeredCities]);

  const handleResetView = () => {
    playSound("click");
    setActiveUnitFilter(0);
    setSearchQuery("");
    if (mapInstance) {
      mapInstance.setView([20.0, 20.0], 3, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  const handleAnswerSubmit = (option: string) => {
    if (!selectedCity) return;

    setUserAnswer(option);
    const isCorrect = option === selectedCity.quiz.correct;

    if (isCorrect) {
      playSound("success");
      setQuizResult("correct");

      const isNew = !answeredCities[selectedCity.name];
      if (isNew) {
        setScore((prev) => prev + 15);
        const updated = { ...answeredCities, [selectedCity.name]: true };
        setAnsweredCities(updated);

        // Check unit badges
        const unitSolved = (unitId: number) =>
          HISTORIC_CITIES_FULL.filter((c) => c.unitId === unitId).every((c) => updated[c.name]);

        if (unitSolved(1)) onUnlockBadge("historian_sudan");
        if (unitSolved(2)) onUnlockBadge("abbasid_scholar");
        if (unitSolved(3)) onUnlockBadge("african_explorer");
        if (unitSolved(4)) onUnlockBadge("renaissance_man");
        if (unitSolved(5)) onUnlockBadge("patriot_shield");

        // Master explorer when all 30 are solved
        if (Object.keys(updated).filter((k) => updated[k]).length >= HISTORIC_CITIES_FULL.length) {
          onUnlockBadge("master_explorer");
        }
      }
    } else {
      playSound("fail");
      setQuizResult("wrong");
    }
  };

  return (
    <div id="map-explorer-container" className="bg-white/95 rounded-2xl border border-amber-200/80 shadow-xl p-4 md:p-6 text-slate-800">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-4 border-b border-amber-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <Compass className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
                خريطة المعرفة التاريخية الشاملة
                <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                  30 معلماً تاريخياً
                </span>
              </h2>
              <p className="text-slate-600 text-xs md:text-sm mt-0.5">
                تغطي كافة دروس كتاب تاريخ السودان وأوروبا الحديث للصف الثاني ثانوي (بخت الرضا). استكشف المواقع الجغرافية، وعِش تفاصيل الأحداث وأجب عن التحديات!
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress & Badges */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="bg-amber-50/80 px-4 py-2 rounded-xl flex items-center gap-3 border border-amber-200 shadow-sm">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500 font-semibold">المعالم المكتشفة والمحلولة:</div>
              <div className="text-sm font-black text-slate-900 font-sans">
                {solvedCount} / {HISTORIC_CITIES_FULL.length}{" "}
                <span className="text-xs text-amber-700 font-normal">
                  ({Math.round((solvedCount / HISTORIC_CITIES_FULL.length) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetView}
            className="bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-300 hover:border-amber-400 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="إعادة ضبط الخريطة"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">إعادة ضبط</span>
          </button>
        </div>
      </div>

      {/* Unit Filters & Search Bar */}
      <div className="my-4 space-y-3">
        {/* Unit Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none select-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 ml-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" /> تصفية بالوحدة:
          </span>
          {UNIT_FILTERS.map((f) => {
            const isSelected = activeUnitFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleUnitFilterChange(f.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-amber-50/80 border-slate-200 text-slate-700"
                }`}
              >
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Map Layer Mode Controls */}
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مدينة، معركة، مملكة، أو شاهد تاريخي..."
              className="w-full bg-white border border-slate-300 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Map Layer Mode Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none select-none">
            <span className="text-[11px] text-slate-500 font-semibold shrink-0 ml-1">نمط الخريطة:</span>
            {MAP_LAYERS.map((layer) => {
              const LayerIcon = layer.icon;
              const isSelected = mapStyle === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    playSound("click");
                    setMapStyle(layer.id);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition cursor-pointer flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? "bg-amber-500 border-amber-600 text-white font-bold"
                      : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700"
                  }`}
                >
                  <LayerIcon className="w-3 h-3" />
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Map on Left/Top, Details on Right/Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-100 border border-slate-300 rounded-xl relative h-[450px] lg:h-[580px] overflow-hidden shadow-inner">
          <div ref={mapRef} id="map-canvas" className="w-full h-full" />
          
          {/* Quick overlay counter */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm pointer-events-none z-[500]">
            المعالم المعروضة: {filteredCities.length} من {HISTORIC_CITIES_FULL.length}
          </div>
        </div>

        {/* Informative City Details & Quiz Card */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-amber-200 rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-sm min-h-[450px]">
          {selectedCity ? (
            <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
              {/* Header */}
              <div className="pb-3 border-b border-amber-100">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="bg-amber-100 text-amber-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                    {selectedCity.unitTitle}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    {selectedCity.lessonTitle}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold font-serif text-slate-900 leading-tight">
                  {selectedCity.name}
                </h3>
                <div className="text-xs font-bold text-amber-700 mt-0.5">
                  {selectedCity.historicalTitle}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    📍 {selectedCity.country}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    ⏳ {selectedCity.era}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="text-slate-700 text-xs md:text-sm leading-relaxed font-serif bg-amber-50/40 p-3 rounded-lg border border-amber-100">
                {selectedCity.description}
              </div>

              {/* Curriculum Evidence Note */}
              <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">الشاهد المنهجي (كتاب بخت الرضا): </span>
                  <span>{selectedCity.curriculumEvidence}</span>
                </div>
              </div>

              {/* Interactive Challenge Quiz */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-slate-800 font-bold text-xs">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>تحدي المعرفة السريع (+15 نقطة):</span>
                  </div>
                  {answeredCities[selectedCity.name] && (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> تم الإنجاز
                    </span>
                  )}
                </div>

                <p className="text-slate-800 text-xs md:text-sm font-semibold leading-relaxed">
                  {selectedCity.quiz.text}
                </p>

                <div className="space-y-1.5">
                  {selectedCity.quiz.options.map((option, oIdx) => {
                    const isUserChoice = userAnswer === option;
                    const isCorrectAnswer = option === selectedCity.quiz.correct;

                    let btnStyle = "bg-white hover:bg-amber-50 border-slate-200 text-slate-800 hover:border-amber-300";
                    if (userAnswer) {
                      if (isCorrectAnswer) {
                        btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                      } else if (isUserChoice) {
                        btnStyle = "bg-rose-100 border-rose-400 text-rose-900 font-bold";
                      } else {
                        btnStyle = "bg-slate-100 border-slate-200 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={!!userAnswer}
                        onClick={() => handleAnswerSubmit(option)}
                        className={`w-full text-right p-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {userAnswer && isCorrectAnswer && <Check className="w-4 h-4 text-emerald-600" />}
                        {userAnswer && isUserChoice && !isCorrectAnswer && <X className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Message */}
                {quizResult === "correct" && (
                  <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-2 rounded-lg text-xs font-bold text-center animate-bounce">
                    🎉 إجابة صحيحة وممتازة! نلت +15 نقطة في رصيدك المعرفي!
                  </div>
                )}
                {quizResult === "wrong" && (
                  <div className="bg-rose-100 text-rose-900 border border-rose-300 p-2 rounded-lg text-xs font-semibold text-center">
                    ❌ إجابة خاطئة. الإجابة الصحيحة هي: {selectedCity.quiz.correct}.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto text-slate-500">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-3 text-amber-600 shadow-sm">
                <Compass className="w-8 h-8 animate-[spin_12s_linear_infinite]" />
              </div>
              <h4 className="font-serif font-bold text-lg text-slate-900">
                بانتظار اختيار معلم تاريخي
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed">
                انقر على أي من الأعلام والمعالم التاريخية الثلاثين المنتشرة على الخريطة لتكبير موقعها وتصفح أحداثها وحل تحديها!
              </p>
            </div>
          )}

          {/* Footer Quick Landmark Navigator Carousel/Pills */}
          <div className="pt-3 mt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
              <span>انتقال سريع لأشهر المعالم:</span>
              <span>{filteredCities.length} متوفر</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filteredCities.slice(0, 10).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCitySelect(c)}
                  className={`text-[11px] px-2 py-0.5 rounded border whitespace-nowrap transition cursor-pointer ${
                    selectedCity?.id === c.id
                      ? "bg-amber-600 border-amber-600 text-white font-bold"
                      : answeredCities[c.name]
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-700"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
