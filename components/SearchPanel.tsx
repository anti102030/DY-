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
            <option value="">선택</option>
            <option value="원룸">원ㆍ투룸</option>
            <option value="쓰리룸">쓰리ㆍ포룸</option>
            <option value="테라스">테라스ㆍ복층</option>
            <option value="타운하우스">타운하우스</option>
          </select>
          <input name="keyword" placeholder="검색하시려는 주소, 지하철역, 제목을 입력하세요" />
        </div>

        <div className="km-search-row km-search-row-bottom">
          <select name="city" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">시도</option>
            <option value="서울">서울특별시</option>
            <option value="경기">경기도</option>
            <option value="인천">인천광역시</option>
          </select>
          <select name="district" defaultValue=""><option value="">구군</option></select>
          <select name="neighborhood" defaultValue=""><option value="">동</option></select>
          <select name="line" defaultValue="">
            <option value="">호선</option>
            <option>1호선</option><option>2호선</option><option>3호선</option>
            <option>4호선</option><option>5호선</option><option>6호선</option>
            <option>7호선</option><option>8호선</option><option>9호선</option>
          </select>
          <select name="station" defaultValue=""><option value="">역</option></select>
        </div>
      </div>

      <button type="submit" className="km-search-button"><span>⌕</span>매물검색</button>
    </form>
  );
}
