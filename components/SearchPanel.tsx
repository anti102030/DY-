"use client";

import { useState } from "react";

export default function SearchPanel() {
  const [city, setCity] = useState("");

  return (
    <form action="/listings" method="get" className="km-search">
      <div className="km-search-title">통합검색</div>

      <div className="km-search-fields">
        <div className="km-search-row km-search-row-top">
          <select name="type" defaultValue="">
            <option value="">매물종류</option>
            <option value="원룸">원ㆍ투룸</option>
            <option value="쓰리룸">쓰리ㆍ포룸</option>
            <option value="테라스">테라스ㆍ복층</option>
            <option value="타운하우스">타운하우스</option>
          </select>

          <input
            name="keyword"
            placeholder="주소, 지하철역, 제목 검색"
          />
        </div>

        <div className="km-search-row km-search-row-bottom">
          <select
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">시도</option>
            <option value="서울">서울특별시</option>
            <option value="경기">경기도</option>
            <option value="인천">인천광역시</option>
          </select>

          <select name="district" defaultValue="">
            <option value="">구군</option>
          </select>

          <select name="neighborhood" defaultValue="">
            <option value="">동</option>
          </select>

          <select name="line" defaultValue="">
            <option value="">호선</option>
            <option>1호선</option>
            <option>2호선</option>
            <option>3호선</option>
            <option>4호선</option>
            <option>5호선</option>
            <option>6호선</option>
            <option>7호선</option>
            <option>8호선</option>
            <option>9호선</option>
          </select>

          <select name="station" defaultValue="">
            <option value="">역</option>
          </select>
        </div>
      </div>

      <button type="submit" className="km-search-button">
        <span>⌕</span>
        매물검색
      </button>

      <style jsx>{`
        .km-search {
          width: 100%;
          min-width: 0;
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr) 150px;
          border: 1px solid #d8d8d8;
          background: #fff;
          box-sizing: border-box;
        }

        .km-search-title {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 118px;
          background: #6e6e6e;
          color: #fff;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .km-search-fields {
          min-width: 0;
          padding: 16px;
          box-sizing: border-box;
        }

        .km-search-row {
          display: grid;
          gap: 8px;
        }

        .km-search-row-top {
          grid-template-columns: 150px minmax(0, 1fr);
          margin-bottom: 8px;
        }

        .km-search-row-bottom {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .km-search select,
        .km-search input {
          width: 100%;
          min-width: 0;
          height: 36px;
          padding: 0 10px;
          border: 1px solid #d5d5d5;
          background: #fff;
          color: #555;
          font-size: 12px;
          box-sizing: border-box;
        }

        .km-search input::placeholder {
          color: #999;
        }

        .km-search-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-left: 1px solid #d8d8d8;
          background: #fff;
          color: #111;
          font-size: 20px;
          font-weight: 900;
          cursor: pointer;
        }

        .km-search-button span {
          font-size: 28px;
          line-height: 1;
        }

        @media (max-width: 820px) {
          .km-search {
            display: block;
            border: 1px solid #ddd;
            padding: 12px;
          }

          .km-search-title {
            min-height: auto;
            margin-bottom: 10px;
            padding: 10px 12px;
            justify-content: flex-start;
            background: #333;
            font-size: 17px;
            border-radius: 4px;
          }

          .km-search-fields {
            padding: 0;
          }

          .km-search-row-top {
            grid-template-columns: 120px minmax(0, 1fr);
            margin-bottom: 8px;
          }

          .km-search-row-bottom {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .km-search-row-bottom select:last-child {
            grid-column: 1 / -1;
          }

          .km-search select,
          .km-search input {
            height: 42px;
            font-size: 13px;
          }

          .km-search-button {
            width: 100%;
            height: 46px;
            margin-top: 10px;
            border: 0;
            border-radius: 4px;
            background: #f4b420;
            color: #111;
            font-size: 15px;
          }

          .km-search-button span {
            font-size: 22px;
          }
        }

        @media (max-width: 520px) {
          .km-search {
            padding: 10px;
          }

          .km-search-row-top {
            grid-template-columns: 1fr;
          }

          .km-search-row-bottom {
            grid-template-columns: 1fr 1fr;
          }

          .km-search-row-bottom select:last-child {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </form>
  );
}