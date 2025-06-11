"use client";
import React, { useEffect, useCallback } from "react";
import { useMusicContext } from "./MusicProvider";

const useAudioDeviceDetector = () => {
  const { isPlay, pauseMusic } = useMusicContext(); // Assuming pauseMusic exists in context

  const handleDeviceMotion = useCallback((event) => {
    if (!event.acceleration) return;

    let lastAcceleration = { x: 0, y: 0, z: 0 };
    let motionThreshold = 8;

    const { x, y, z } = event.acceleration;

    // Tính toán sự thay đổi gia tốc
    const deltaX = Math.abs(x - lastAcceleration.x);
    const deltaY = Math.abs(y - lastAcceleration.y);
    const deltaZ = Math.abs(z - lastAcceleration.z);

    // Kiểm tra chuyển động đột ngột
    if (
      deltaX > motionThreshold ||
      deltaY > motionThreshold ||
      deltaZ > motionThreshold
    ) {
      console.log(
        "Phát hiện chuyển động mạnh - có thể AirPods được đặt vào/tháo ra"
      );

      // Delay một chút rồi kiểm tra lại danh sách thiết bị
      setTimeout(() => {
        updateDeviceList();
      }, 500);
    }

    lastAcceleration = { x, y, z };
  }, []);

  const onHeadphonesConnected = useCallback(() => {
    console.log("Tai nghe đã được cắm vào");
    // Thêm logic xử lý khi tai nghe được kết nối
  }, []);

  const onHeadphonesDisconnected = useCallback(() => {
    console.log("Tai nghe đã được rút ra");
    // Thêm logic xử lý khi tai nghe bị ngắt kết nối
  }, []);

  const onBluetoothDeviceConnected = useCallback((device) => {
    console.log("Thiết bị Bluetooth kết nối:", device.name);
    // Kiểm tra nếu là tai nghe Bluetooth
    if (/airpods|headphones|earbuds|headset/i.test(device.name || "")) {
      console.log("Tai nghe Bluetooth được kết nối");
      onHeadphonesConnected();
    }
  }, [onHeadphonesConnected]);

  const onBluetoothDeviceDisconnected = useCallback((device) => {
    console.log("Thiết bị Bluetooth ngắt kết nối:", device.name);
    // Kiểm tra nếu là tai nghe Bluetooth
    if (/airpods|headphones|earbuds|headset/i.test(device.name || "")) {
      console.log("Tai nghe Bluetooth bị ngắt kết nối");
      onHeadphonesDisconnected();
    }
  }, [onHeadphonesDisconnected]);

  const updateDeviceList = useCallback(() => {
    let idDeviceAudio = null;

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        console.log(
          "Danh sách thiết bị audio:",
          devices.filter((d) => d.kind.includes("audio"))
        );

        // Kiểm tra audio output (tai nghe/loa)
        const audioOutputs = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        const defaultAudio = audioOutputs.find(
          (device) => device.deviceId === "default"
        );

        if (defaultAudio && defaultAudio.groupId !== idDeviceAudio) {
          console.log("Thiết bị audio thay đổi:", defaultAudio.label);

          // Kiểm tra nếu là loa và đang phát nhạc thì dừng
          if (isPlay?.current && /Speakers|Speaker/.test(defaultAudio.label)) {
            console.log("Chuyển sang loa, tạm dừng phát nhạc");
            // Fixed: Use pauseMusic from context instead of buttonPlayRef
            if (pauseMusic) {
              pauseMusic();
            }
          }

          // Kiểm tra nếu là tai nghe
          if (
            /headphones|earbuds|airpods|headset/i.test(defaultAudio.label)
          ) {
            console.log("Tai nghe được kết nối");
            onHeadphonesConnected();
          }

          idDeviceAudio = defaultAudio.groupId;
        }

        // Kiểm tra audio input (microphone)
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );
        audioInputs.forEach((device) => {
          if (/headphones|earbuds|airpods|headset/i.test(device.label)) {
            console.log("Microphone tai nghe được phát hiện:", device.label);
          }
        });
      })
      .catch((err) => {
        console.error("Không thể liệt kê thiết bị:", err);
      });
  }, [isPlay, pauseMusic, onHeadphonesConnected]);

  const scanBluetoothDevices = useCallback(async () => {
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth không được hỗ trợ");
      return;
    }

    const connectedBluetoothDevices = new Set();

    try {
      const device = await navigator.bluetooth.requestDevice({
        // Lọc theo audio devices
        filters: [
          { services: ["battery_service"] },
          { services: [0x180f] }, // Battery Service
        ],
        optionalServices: ["battery_service", "device_information"],
        acceptAllDevices: false,
      });

      console.log("Thiết bị Bluetooth được chọn:", device.name);

      // Lắng nghe sự kiện ngắt kết nối
      device.addEventListener("gattserverdisconnected", () => {
        console.log("Thiết bị Bluetooth bị ngắt kết nối:", device.name);
        connectedBluetoothDevices.delete(device.id);
        onBluetoothDeviceDisconnected(device);
      });

      // Kết nối với thiết bị
      const server = await device.gatt.connect();
      console.log("Đã kết nối với GATT server");

      connectedBluetoothDevices.add(device.id);
      onBluetoothDeviceConnected(device);

      return device;
    } catch (error) {
      console.error("Lỗi kết nối Bluetooth:", error);
    }
  }, [onBluetoothDeviceConnected, onBluetoothDeviceDisconnected]);

  const initBluetooth = useCallback(async () => {
    if (!navigator.bluetooth) {
      console.log("Trình duyệt không hỗ trợ Web Bluetooth API");
      return;
    }

    try {
      // Kiểm tra trạng thái Bluetooth
      const availability = await navigator.bluetooth.getAvailability();
      console.log("Bluetooth khả dụng:", availability);

      // Lắng nghe thay đổi trạng thái Bluetooth
      navigator.bluetooth.addEventListener("availabilitychanged", (event) => {
        console.log("Trạng thái Bluetooth thay đổi:", event.value);
      });
    } catch (error) {
      console.error("Lỗi khởi tạo Bluetooth:", error);
    }
  }, []);

  const addMediaDevice = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(async (stream) => {
        // Dừng stream sau khi lấy permission
        stream.getTracks().forEach((track) => track.stop());
        updateDeviceList();
      })
      .catch((err) => {
        console.error("Không thể truy cập microphone:", err);
      });
  }, [updateDeviceList]);

  const getCurrentAudioDevices = useCallback(() => {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioDevices = devices.filter(
        (device) =>
          device.kind === "audiooutput" || device.kind === "audioinput"
      );
      return audioDevices;
    });
  }, []);

  useEffect(() => {
    if (!isPlay?.current) return;
    
    console.log(isPlay);
    console.log("Khởi tạo hệ thống phát hiện thiết bị audio...");

    // Khởi tạo media devices
    addMediaDevice();

    // Khởi tạo Bluetooth
    initBluetooth();

    // Lắng nghe device motion
    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleDeviceMotion, false);
    } else {
      console.log("DeviceMotion không được hỗ trợ");
    }

    // Lắng nghe thay đổi thiết bị
    const deviceChangeHandler = () => {
      console.log("Thiết bị thay đổi");
      updateDeviceList();
    };

    navigator.mediaDevices.addEventListener("devicechange", deviceChangeHandler);

    // Export functions để có thể gọi từ console
    window.audioDeviceManager = {
      scan: scanBluetoothDevices,
      getCurrentDevices: getCurrentAudioDevices,
      updateDeviceList: updateDeviceList,
    };

    // Cleanup function
    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleDeviceMotion, false);
      }
      navigator.mediaDevices.removeEventListener("devicechange", deviceChangeHandler);
      
      // Cleanup window object
      if (window.audioDeviceManager) {
        delete window.audioDeviceManager;
      }
    };
  }, [
    isPlay,
    addMediaDevice,
    initBluetooth,
    handleDeviceMotion,
    updateDeviceList,
    scanBluetoothDevices,
    getCurrentAudioDevices
  ]);
};

export default useAudioDeviceDetector;