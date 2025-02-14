"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ButtonSubmit from "@/components/ButtonSubmit/ButtonSubmit";

// Đảm bảo icon marker hiển thị đúng
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const Map = () => {
  const mapRef = useRef(null);
  const [position, setPosition] = useState([21.02985, 105.85164]); // Tọa độ mặc định (Hà Nội)
  const [markers, setMarkers] = useState([]); // Danh sách các marker tìm kiếm
  const [apiPolygons, setApiPolygons] = useState([]); // Dữ liệu polygon trả về từ API

  // Component tự động căn giữa map khi thay đổi position
  const RecenterAutomatically = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);
    return null;
  };

  // Hàm tìm kiếm địa điểm bằng Nominatim API (ví dụ)
  const searchLocation = async (formData) => {
    const searchParams = new URLSearchParams(Object.fromEntries(formData));
    const queryString = searchParams.toString();
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${queryString}&format=json&addressdetails=1&limit=5`
    );
    const data = await res.json();

    if (data.length === 0) {
      return;
    }

    const markets = data.map((item) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name,
    }));
    setMarkers(markets);

    // Cập nhật tọa độ trung tâm theo kết quả đầu tiên
    const firstResult = markets[0];
    setPosition([firstResult.lat, firstResult.lon]);
  };

  // Khởi tạo icon cho Marker toàn cục
  useEffect(() => {
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  // Fetch dữ liệu polygon từ API khi component mount
  useEffect(() => {
    async function fetchPolygonData() {
      try {
        // Thay "/api/polygons" bằng endpoint thực tế của bạn
        const res = await fetch("/api/polygons");
        if (!res.ok) {
          throw new Error("Error fetching polygon data");
        }
        const data = await res.json();
        // Giả sử data là một mảng các đối tượng có cấu trúc: { id, tag, info, coordinates }
        setApiPolygons(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPolygonData();
  }, []);

  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Sử dụng FormData để lấy dữ liệu từ form và gọi searchLocation
          const formData = new FormData(e.target);
          searchLocation(formData);
        }}
        className="flex"
      >
        <input
          className="rounded-none border text-background w-full py-1 px-2 focus:bg-border outline-none"
          type="text"
          placeholder="VD: Các lực lượng quân sự ở biển Đông"
          name="q"
        />
        <ButtonSubmit label="Vẽ" />
      </form>
      <div className="mt-2">
        <div style={{ height: "0", width: "100%" }} ref={mapRef}>
          <MapContainer
            center={position}
            zoom={5}
            style={{ height: "calc(100vh - 320px)", width: "100%" }}
          >
            {/* Layer bản đồ nền */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marker cho kết quả tìm kiếm */}
            {markers.map((marker, index) => (
              <Marker position={[marker.lat, marker.lon]} key={index}>
                <Popup>{marker.display_name}</Popup>
              </Marker>
            ))}

            <RecenterAutomatically />

            {/* Vẽ các polygon dựa trên dữ liệu trả về từ API */}
            {apiPolygons.map((poly) => (
              <Polygon
                key={poly.id}
                positions={poly.coordinates}
                pathOptions={{ color: "purple", fillOpacity: 0.4 }}
              >
                <Popup>
                  <div>
                    <h3>{poly.tag}</h3>
                    <p>{poly.info}</p>
                    {/* Hiển thị tọa độ nếu cần */}
                    <pre>{JSON.stringify(poly.coordinates, null, 2)}</pre>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;