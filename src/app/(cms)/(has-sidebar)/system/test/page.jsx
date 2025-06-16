// page.js - Cải thiện để debug và tránh re-render issue

"use client";

import { httpClientBlob } from "@/utils/client/http";
import React, { useState, useContext } from "react";
import { getDataPost } from "./action";
import { CMSContext } from "@/context/cms/CMSProvider";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  const { profile } = useContext(CMSContext);

  // Debug function để log profile state
  const logProfileState = () => {
    console.log("=== PROFILE DEBUG ===");
    console.log("Profile object:", profile);
    console.log("Has user:", !!profile?.user);
    console.log("User ID:", profile?.user?._id);
    console.log("Profile keys:", Object.keys(profile || {}));
    console.log("==================");
    
    setDebugInfo(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      profile: profile ? { ...profile } : null,
      hasUser: !!profile?.user,
      userId: profile?.user?._id
    }]);
  };

  const checkRefreshTokenOnClient = async () => {
    if (isLoading) return;
    
    logProfileState(); // Log trước khi bắt đầu
    
    setIsLoading(true);
    try {
      const token = "3453454353"; // Invalid token để trigger refresh
      const newFormData = new FormData();
      newFormData.append("format", "pdf");
      
      const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL + "customers/export";
      const headers = {
        Authorization: "Bearer " + token,
      };

      console.log("=== STARTING CLIENT REQUESTS ===");
      
      // Tạo promises nhưng KHÔNG await Promise.allSettled
      // Thay vào đó, await từng cái một để tránh concurrent render
      const results = [];
      
      for (let i = 0; i < 3; i++) {
        console.log(`Making request ${i + 1}`);
        
        try {
          const result = await httpClientBlob(endpoint, headers, newFormData, "POST");
          results.push({ success: true, data: result, index: i + 1 });
          console.log(`Request ${i + 1} completed successfully`);
          
          // Log profile state sau mỗi request
          logProfileState();
          
        } catch (error) {
          results.push({ success: false, error: error.message, index: i + 1 });
          console.error(`Request ${i + 1} failed:`, error);
        }
        
        // Thêm delay nhỏ giữa các requests để tránh race condition
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log("=== ALL CLIENT REQUESTS COMPLETED ===");
      console.log("Results:", results);
      
      // Log profile state cuối cùng
      logProfileState();

    } catch (error) {
      console.error("Error in checkRefreshTokenOnClient:", error);
      logProfileState();
    } finally {
      setIsLoading(false);
    }
  };

  const checkRefreshTokenOnServer = async () => {
    if (isLoading) return;
    
    logProfileState(); // Log trước khi bắt đầu
    
    setIsLoading(true);
    try {
      console.log("=== STARTING SERVER REQUESTS ===");
      
      // Sequential requests thay vì concurrent
      const endpoints = ["links", "topics", "posts"];
      const results = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Making server request to: ${endpoint}`);
          const result = await getDataPost(endpoint);
          results.push({ success: true, endpoint, data: result });
          console.log(`${endpoint} request completed`);
          
          // Log profile state sau mỗi request  
          logProfileState();
          
        } catch (error) {
          results.push({ success: false, endpoint, error: error.message });
          console.error(`${endpoint} request failed:`, error);
        }
        
        // Delay nhỏ giữa các requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log("=== ALL SERVER REQUESTS COMPLETED ===");
      console.log("Results:", results);
      
      // Log profile state cuối cùng
      logProfileState();

    } catch (error) {
      console.error("Error in checkRefreshTokenOnServer:", error);
      logProfileState();
    } finally {
      setIsLoading(false);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3>Current Profile Status:</h3>
        <pre style={{ background: "#f5f5f5", padding: "10px", fontSize: "12px" }}>
          {JSON.stringify({
            hasProfile: !!profile,
            hasUser: !!profile?.user,
            userId: profile?.user?._id,
            userName: profile?.user?.name,
            profileKeys: Object.keys(profile || {})
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={checkRefreshTokenOnClient}
          disabled={isLoading}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          {isLoading ? "Loading..." : "Refresh Token Client (Sequential)"}
        </button>
        
        <button 
          onClick={checkRefreshTokenOnServer}
          disabled={isLoading}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          {isLoading ? "Loading..." : "Refresh Token Server (Sequential)"}
        </button>
        
        <button 
          onClick={logProfileState}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          Log Profile State
        </button>
        
        <button 
          onClick={clearDebugInfo}
          style={{ padding: "10px" }}
        >
          Clear Debug Info
        </button>
      </div>

      {debugInfo.length > 0 && (
        <div>
          <h3>Debug Timeline:</h3>
          <div style={{ maxHeight: "400px", overflow: "auto", border: "1px solid #ccc", padding: "10px" }}>
            {debugInfo.map((info, index) => (
              <div key={index} style={{ marginBottom: "10px", padding: "5px", background: "#f9f9f9" }}>
                <strong>{info.timestamp}:</strong>
                <div style={{ fontSize: "12px", marginTop: "5px" }}>
                  Has User: {info.hasUser ? "✅" : "❌"} | 
                  User ID: {info.userId || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;