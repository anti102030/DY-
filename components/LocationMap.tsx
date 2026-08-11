"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const ADDRESS = "서울특별시 강서구 등촌동 526-26 1층 다이아부동산";
const PLACE_NAME = "DY다이아부동산 리브타워 103호";
const SCRIPT_ID = "dy-kakao-map-sdk";

export default function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (!appKey) {
      setError("카카오맵 키가 설정되지 않았습니다.");
      return;
    }

    let cancelled = false;

    const initializeMap = () => {
      if (cancelled || !mapRef.current || !window.kakao?.maps) {
        return;
      }

      window.kakao.maps.load(() => {
        if (cancelled || !mapRef.current) return;

        if (!window.kakao.maps.services) {
          setError("카카오맵 주소 검색 서비스를 불러오지 못했습니다.");
          return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(
          ADDRESS,
          (result: any[], status: string) => {
            if (cancelled || !mapRef.current) return;

            if (
              status !== window.kakao.maps.services.Status.OK ||
              !result?.[0]
            ) {
              setError("주소 위치를 불러오지 못했습니다.");
              return;
            }

            const position = new window.kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x)
            );

            const map = new window.kakao.maps.Map(mapRef.current, {
              center: position,
              level: 3,
            });

            const marker = new window.kakao.maps.Marker({
              map,
              position,
            });

            const infoWindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="
                  min-width:220px;
                  padding:10px 12px;
                  color:#222;
                  font-size:12px;
                  line-height:1.5;
                  text-align:center;
                ">
                  <strong style="font-size:13px;">
                    ${PLACE_NAME}
                  </strong>
                  <br />
                  ${ADDRESS}
                </div>
              `,
            });

            infoWindow.open(map, marker);

            window.kakao.maps.event.addListener(marker, "click", () => {
              infoWindow.open(map, marker);
            });

            setError("");
          }
        );
      });
    };

    if (window.kakao?.maps) {
      initializeMap();

      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        initializeMap();
      } else {
        existingScript.addEventListener("load", initializeMap);
      }

      return () => {
        cancelled = true;
        existingScript.removeEventListener("load", initializeMap);
      };
    }

    const script = document.createElement("script");

    script.id = SCRIPT_ID;
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js` +
      `?appkey=${appKey}` +
      `&autoload=false` +
      `&libraries=services`;

    script.async = true;

    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      initializeMap();
    });

    script.addEventListener("error", () => {
      setError("카카오맵 SDK를 불러오지 못했습니다.");
    });

    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "460px",
          border: "1px solid #d8d8d8",
          background: "#f5f5f5",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
