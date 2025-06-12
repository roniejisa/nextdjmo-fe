"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Film,
} from "lucide-react";
import ButtonUpload from "./ButtonUpload";
import useRouterCustom from "@/packages/translation/Navigation";
import { convertVideoToTs, refreshPath } from "./action";
import { usePathname, useSearchParams } from "next/navigation";

const VideoStatusBadge = ({ status }) => {
  const statusConfig = {
    converted: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-800",
      text: "Converted",
    },
    converting: {
      icon: RefreshCw,
      color: "bg-blue-100 text-blue-800",
      text: "Converting",
    },
    pending: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800",
      text: "Pending",
    },
    failed: {
      icon: AlertCircle,
      color: "bg-red-100 text-red-800",
      text: "Failed",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      <Icon
        className={`w-3 h-3 mr-1 ${
          status === "converting" ? "animate-spin" : ""
        }`}
      />
      {config.text}
    </span>
  );
};

const VideoCard = ({ item, onConvert, isConverting }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-[0_0_70%] max-w-[70%]">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div className="max-w-[160px] overflow-hidden">
            <h3
              title={item.name}
              className="font-semibold text-gray-900 truncate max-w-xs"
            >
              {item.name}
            </h3>
            <p className="text-sm text-gray-500">
              {item.size} • {item.duration}
            </p>
          </div>
        </div>
        <VideoStatusBadge status={item.converted} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Created: {new Date(item.created_at).toLocaleDateString()}
        </div>

        {item.converted !== "converted" && item.converted !== "converting" && (
          <button
            onClick={() => onConvert(item._id)}
            disabled={isConverting === item._id}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {isConverting === item._id ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1.5" />
                Convert to TS
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const ClientVideoPage = ({ items, permissions, moduleName, nameLabel }) => {
  const [isConverting, setIsConverting] = useState(false);
  const router = useRouterCustom();
  const url = usePathname();
  const searchParams = useSearchParams();

  const fullUrl =
    url + (searchParams.toString() ? "?" + searchParams.toString() : "");
  // Safe stats calculation - sử dụng optional chaining và default values
  const stats = {
    total: items?.length ?? 0,
    completed:
      items?.filter((item) => item.converted === "converted")?.length ?? 0,
    converting:
      items?.filter((item) => item.converted === "converting")?.length ?? 0,
    pending: items?.filter((item) => item.converted === "pending")?.length ?? 0,
  };

  const refreshData = async () => {
    router.push(fullUrl, true);
  };

  useEffect(() => {
    const hasConvertingVideos = isConverting
      ? true
      : items?.some((item) => ["converting"].includes(item.converted));
      
    if (!hasConvertingVideos && isConverting) {
      setIsConverting(false);
    }

    if (!hasConvertingVideos) return;
    const timer = setInterval(() => {
      refreshData();
    }, 5000);

    return () => clearInterval(timer);
  }, [items, isConverting]);

  const handleConvert = async (itemId) => {
    setIsConverting(itemId);
    await convertVideoToTs(itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{nameLabel}</h1>
            <p className="text-gray-600 mt-1">
              Manage and convert your video files to TS format
            </p>
          </div>

          {permissions.includes(moduleName + ".create") && <ButtonUpload />}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Videos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Converting</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.converting}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <VideoCard
              key={item._id}
              item={item}
              onConvert={() => handleConvert(item._id)}
              isConverting={isConverting}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by uploading your first video
            </p>
            {permissions.includes("videos.create") && <ButtonUpload />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientVideoPage;
