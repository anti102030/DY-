"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const MAP_ADDRESS =
  "서울특별시 강서구 등촌동 526-26";

const MAP_LABEL =
  "서울 강서구 등촌동 526-26 1층 DY다이아부동산";

export default function OfficeKakaoMap() {
  const mapRef =
    useRef<HTMLDivElement>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const appKey =
      process.env
        .NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (!appKey) {
      console.error(
        "카카오 JavaScript 키가 없습니다.",
      );

      setErrorMessage(
        ".env.local의 NEXT_PUBLIC_KAKAO_MAP_KEY를 확인해주세요.",
      );

      setLoading(false);

      return;
    }

    function showError(message: string) {
      console.error(message);

      if (!cancelled) {
        setErrorMessage(message);
        setLoading(false);
      }
    }

    function initializeMap() {
      if (cancelled) {
        return;
      }

      if (
        !window.kakao ||
        !window.kakao.maps
      ) {
        showError(
          "카카오 지도 SDK를 불러오지 못했습니다.",
        );

        return;
      }

      window.kakao.maps.load(() => {
        if (
          cancelled ||
          !mapRef.current
        ) {
          return;
        }

        try {
          const kakao =
            window.kakao;

          if (
            !kakao.maps.services
          ) {
            showError(
              "카카오 지도 services 라이브러리를 불러오지 못했습니다.",
            );

            return;
          }

          const geocoder =
            new kakao.maps.services.Geocoder();

          geocoder.addressSearch(
            MAP_ADDRESS,
            (
              result: any[],
              status: string,
            ) => {
              if (cancelled) {
                return;
              }

              if (
                status !==
                  kakao.maps.services
                    .Status.OK ||
                !result ||
                !result[0]
              ) {
                showError(
                  `주소 검색에 실패했습니다: ${MAP_ADDRESS}`,
                );

                return;
              }

              if (!mapRef.current) {
                return;
              }

              const latitude =
                Number(
                  result[0].y,
                );

              const longitude =
                Number(
                  result[0].x,
                );

              const position =
                new kakao.maps.LatLng(
                  latitude,
                  longitude,
                );

              const map =
                new kakao.maps.Map(
                  mapRef.current,
                  {
                    center: position,

                    // 숫자가 작을수록 확대
                    level: 4,
                  },
                );

              const marker =
                new kakao.maps.Marker({
                  map,
                  position,
                });

              const content = `
                <div
                  style="
                    position:relative;
                    background:#ffffff;
                    border:1px solid #777777;
                    padding:10px 15px;
                    color:#333333;
                    font-size:13px;
                    font-weight:700;
                    white-space:nowrap;
                    box-shadow:0 2px 5px rgba(0,0,0,.12);
                  "
                >
                  ${MAP_LABEL}

                  <span
                    style="
                      position:absolute;
                      left:50%;
                      bottom:-7px;
                      width:12px;
                      height:12px;
                      background:#ffffff;
                      border-right:1px solid #777777;
                      border-bottom:1px solid #777777;
                      transform:translateX(-50%) rotate(45deg);
                    "
                  ></span>
                </div>
              `;

              const overlay =
                new kakao.maps.CustomOverlay({
                  map,
                  position,
                  content,

                  // 말풍선 위치
                  yAnchor: 2.35,
                });

              overlay.setMap(map);

              kakao.maps.event.addListener(
                marker,
                "click",
                () => {
                  overlay.setMap(map);
                },
              );

              // 지도 가운데 약간 아래쪽에
              // 마커가 보이도록 조절
              map.setCenter(position);

              setLoading(false);
              setErrorMessage("");

              console.log(
                "카카오 지도 정상 로딩",
                {
                  latitude,
                  longitude,
                },
              );

              setTimeout(() => {
                map.relayout();
                map.setCenter(position);
              }, 100);
            },
          );
        } catch (error) {
          console.error(error);

          showError(
            "카카오 지도 생성 중 오류가 발생했습니다.",
          );
        }
      });
    }

    /*
      이미 SDK가 존재하는 경우
    */
    if (
      window.kakao &&
      window.kakao.maps
    ) {
      initializeMap();

      return () => {
        cancelled = true;
      };
    }

    /*
      예전에 삽입한 스크립트가
      존재하는 경우 삭제 후 다시 로딩
    */
    const oldScript =
      document.querySelector(
        'script[data-dy-kakao-map="true"]',
      );

    if (oldScript) {
      oldScript.remove();
    }

    const script =
      document.createElement(
        "script",
      );

    script.id =
      "dy-kakao-map-sdk";

    script.dataset.dyKakaoMap =
      "true";

    script.async = true;

    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js" +
      `?appkey=${encodeURIComponent(
        appKey,
      )}` +
      "&autoload=false" +
      "&libraries=services";

    script.onload = () => {
      console.log(
        "카카오 지도 SDK script 로딩 완료",
      );

      initializeMap();
    };

    script.onerror = () => {
      showError(
        "카카오 지도 SDK 다운로드에 실패했습니다. 카카오맵 사용 설정, JavaScript 키, 도메인을 확인해주세요.",
      );
    };

    document.head.appendChild(
      script,
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="dy-office-map-frame">
      <div
        ref={mapRef}
        className="dy-office-map"
      />

      {loading &&
        !errorMessage && (
          <div className="dy-map-message">
            지도를 불러오는 중입니다.
          </div>
        )}

      {errorMessage && (
        <div className="dy-map-error">
          <strong>
            지도를 불러오지
            못했습니다.
          </strong>

          <span>
            {errorMessage}
          </span>
        </div>
      )}

      <style jsx>{`
        .dy-office-map-frame {
          position: relative;
          width: 100%;
          padding: 3px;
          border: 1px solid #d5d5d5;
          background: #f7f7f7;
          box-sizing: border-box;
        }

        .dy-office-map {
          width: 100%;
          height: 300px;
          background: #eeeeee;
        }

        .dy-map-message,
        .dy-map-error {
          position: absolute;
          inset: 4px;

          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          gap: 7px;

          background: #eeeeee;

          color: #777;

          font-size: 13px;

          text-align: center;

          z-index: 10;
        }

        .dy-map-error strong {
          color: #333;
          font-size: 14px;
        }

        .dy-map-error span {
          max-width: 500px;
          padding: 0 20px;
          line-height: 1.6;
        }

        @media (
          max-width: 760px
        ) {
          .dy-office-map {
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
}