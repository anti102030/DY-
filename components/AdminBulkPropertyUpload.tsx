"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

const EXCEL_HEADERS = [
  "제목",
  "매매가",
  "전체 주소",
  "시·도",
  "구·군",
  "동",
  "매물 종류",
  "방",
  "욕실",
  "전용평수",
  "층",
  "방향",
  "관리비",
  "입주 상태",
  "실입주금",
  "융자금",
  "상세 설명",
] as const;

type ExcelHeader = (typeof EXCEL_HEADERS)[number];

type ExcelRow = Record<ExcelHeader, string | number>;

type ParsedProperty = {
  rowNumber: number;
  title: string;
  price: string;
  address: string;
  city: string;
  district: string;
  neighborhood: string;
  property_type: string;
  rooms: number;
  bathrooms: number;
  area_pyeong: number | null;
  floor: string;
  direction: string;
  maintenance_fee: string;
  move_in_status: string;
  deposit: string;
  loan: string;
  description: string;
};

const ALLOWED_CITIES = ["서울", "경기", "인천"];
const ALLOWED_PROPERTY_TYPES = [
  "빌라",
  "아파트",
  "오피스텔",
  "단독주택",
  "타운하우스",
];

function text(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function numberValue(value: unknown, fallback = 0) {
  const cleaned = text(value).replace(/,/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNumber(value: unknown) {
  const cleaned = text(value).replace(/,/g, "");
  if (!cleaned) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCity(value: unknown) {
  const city = text(value)
    .replace("특별시", "")
    .replace("광역시", "")
    .replace("도", "");

  return city;
}

function isExcelFile(file: File) {
  const lowerName = file.name.toLowerCase();
  return lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls");
}

export default function AdminBulkPropertyUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedProperty[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [progressText, setProgressText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const canRegister = rows.length > 0 && errors.length === 0 && !saving;

  const previewRows = useMemo(() => rows.slice(0, 20), [rows]);

  function downloadTemplate() {
    const exampleRows: (string | number)[][] = [
      [...EXCEL_HEADERS],
      [
        "강서구 화곡동 방3 신축급 매물",
        "2억 5,000만원",
        "서울특별시 강서구 화곡동 123-45 다이아빌 5층",
        "서울",
        "강서구",
        "화곡동",
        "빌라",
        3,
        2,
        18.5,
        "5층",
        "남향",
        "5만원",
        "즉시입주",
        "3,000만원",
        "1억 8,000만원",
        "채광이 좋고 생활 인프라가 편리한 매물입니다.",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exampleRows);
    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 16 },
      { wch: 45 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
      { wch: 14 },
      { wch: 15 },
      { wch: 15 },
      { wch: 50 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "매물등록");
    XLSX.writeFile(workbook, "DY다이아주택_매물대량등록_양식.xlsx");
  }

  function validateRows(parsedRows: ExcelRow[]) {
    const nextRows: ParsedProperty[] = [];
    const nextErrors: string[] = [];

    parsedRows.forEach((raw, index) => {
      const rowNumber = index + 2;

      const title = text(raw["제목"]);
      const price = text(raw["매매가"]);
      const address = text(raw["전체 주소"]);
      const city = normalizeCity(raw["시·도"]);
      const district = text(raw["구·군"]);
      const neighborhood = text(raw["동"]);
      const propertyType = text(raw["매물 종류"]) || "빌라";
      const description = text(raw["상세 설명"]);

      if (!title && !price && !address) {
        return;
      }

      if (!title) nextErrors.push(`${rowNumber}행: 제목이 없습니다.`);
      if (!price) nextErrors.push(`${rowNumber}행: 매매가가 없습니다.`);
      if (!address) nextErrors.push(`${rowNumber}행: 전체 주소가 없습니다.`);
      if (!description) {
        nextErrors.push(`${rowNumber}행: 상세 설명이 없습니다.`);
      }

      if (!ALLOWED_CITIES.includes(city)) {
        nextErrors.push(
          `${rowNumber}행: 시·도는 서울, 경기, 인천 중 하나여야 합니다.`
        );
      }

      if (!ALLOWED_PROPERTY_TYPES.includes(propertyType)) {
        nextErrors.push(
          `${rowNumber}행: 매물 종류는 빌라, 아파트, 오피스텔, 단독주택, 타운하우스 중 하나여야 합니다.`
        );
      }

      const area = nullableNumber(raw["전용평수"]);
      if (text(raw["전용평수"]) && area === null) {
        nextErrors.push(`${rowNumber}행: 전용평수는 숫자로 입력해 주세요.`);
      }

      nextRows.push({
        rowNumber,
        title,
        price,
        address,
        city,
        district,
        neighborhood,
        property_type: propertyType,
        rooms: Math.max(0, numberValue(raw["방"], 0)),
        bathrooms: Math.max(0, numberValue(raw["욕실"], 0)),
        area_pyeong: area,
        floor: text(raw["층"]),
        direction: text(raw["방향"]),
        maintenance_fee: text(raw["관리비"]),
        move_in_status: text(raw["입주 상태"]) || "즉시입주",
        deposit: text(raw["실입주금"]),
        loan: text(raw["융자금"]),
        description,
      });
    });

    if (nextRows.length === 0) {
      nextErrors.push("등록할 매물 데이터가 없습니다.");
    }

    setRows(nextRows);
    setErrors(nextErrors);
  }

  async function readExcelFile(file: File) {
    setMessage("");
    setProgressText("");
    setRows([]);
    setErrors([]);

    if (!isExcelFile(file)) {
      setFileName("");
      setErrors(["엑셀 파일(.xlsx 또는 .xls)만 넣을 수 있습니다."]);
      return;
    }

    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        throw new Error("엑셀 시트를 찾을 수 없습니다.");
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
        defval: "",
        raw: false,
      });

      validateRows(rawRows);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "엑셀을 읽지 못했습니다.";

      setErrors([errorMessage]);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      await readExcelFile(file);
    }

    event.target.value = "";
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!saving) {
      setIsDragging(true);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget === event.target) {
      setIsDragging(false);
    }
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (saving) return;

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await readExcelFile(file);
    }
  }

  async function handleRegister() {
    if (!canRegister) return;

    setSaving(true);
    setMessage("");
    setProgressText("");

    try {
      const insertRows = rows.map((row) => ({
        title: row.title,
        price: row.price,
        address: row.address,
        city: row.city,
        district: row.district,
        neighborhood: row.neighborhood,
        property_type: row.property_type,
        rooms: row.rooms,
        bathrooms: row.bathrooms,
        area_pyeong: row.area_pyeong,
        floor: row.floor,
        direction: row.direction,
        maintenance_fee: row.maintenance_fee,
        move_in_status: row.move_in_status,
        deposit: row.deposit,
        loan: row.loan,
        thumbnail_url: "",
        image_urls: [],
        description: row.description,
        status: "공개",
      }));

      const chunkSize = 100;

      for (let start = 0; start < insertRows.length; start += chunkSize) {
        const chunk = insertRows.slice(start, start + chunkSize);
        const completed = Math.min(start + chunk.length, insertRows.length);

        setProgressText(
          `매물 등록 중 ${completed}/${insertRows.length}`
        );

        const { error } = await supabase.from("properties").insert(chunk);

        if (error) {
          throw new Error(error.message);
        }
      }

      setMessage(
        `${insertRows.length}개 매물이 사진 없이 공개 상태로 등록되었습니다.`
      );

      router.push("/admin");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      setMessage(`대량등록 실패: ${errorMessage}`);
    } finally {
      setSaving(false);
      setProgressText("");
    }
  }

  return (
    <section className="bulk-upload-panel">
      <div className="bulk-guide">
        <strong>등록 방법</strong>
        <p>
          양식을 내려받아 작성한 뒤 아래 영역에 파일을 드래그하거나 클릭해서
          업로드하세요. 등록된 매물은 모두 사진 없이 공개 상태로 저장됩니다.
          관리자 목록에서 수정 버튼을 눌러 사진을 추가하거나 내용을 수정할 수 있습니다.
        </p>
      </div>

      <div className="bulk-actions">
        <button
          type="button"
          className="bulk-template-button"
          onClick={downloadTemplate}
          disabled={saving}
        >
          엑셀 양식 다운로드
        </button>
      </div>

      <div
        className={`bulk-drop-zone ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!saving) {
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !saving) {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={saving}
          hidden
        />

        <div className="bulk-drop-icon">⇩</div>

        <strong>
          {isDragging
            ? "여기에 파일을 놓으세요"
            : "엑셀 파일을 이곳에 드래그해서 넣으세요"}
        </strong>

        <span>또는 여기를 클릭해서 파일을 선택하세요.</span>

        {fileName && (
          <div className="bulk-selected-file">
            선택된 파일: <b>{fileName}</b>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="bulk-error-box">
          <strong>수정이 필요한 내용</strong>
          <ul>
            {errors.slice(0, 30).map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>

          {errors.length > 30 && (
            <p>오류가 많아 처음 30개만 표시했습니다.</p>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="bulk-summary">
            <strong>확인된 매물: {rows.length}개</strong>
            <span>미리보기는 최대 20개까지 표시됩니다.</span>
          </div>

          <div className="bulk-table-wrap">
            <table className="bulk-table">
              <thead>
                <tr>
                  <th>행</th>
                  <th>제목</th>
                  <th>매매가</th>
                  <th>지역</th>
                  <th>종류</th>
                  <th>방/욕실</th>
                  <th>상태</th>
                </tr>
              </thead>

              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.rowNumber}>
                    <td>{row.rowNumber}</td>
                    <td>{row.title}</td>
                    <td>{row.price}</td>
                    <td>
                      {row.city} {row.district} {row.neighborhood}
                    </td>
                    <td>{row.property_type}</td>
                    <td>
                      {row.rooms}/{row.bathrooms}
                    </td>
                    <td>공개</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {progressText && <p className="admin-message">{progressText}</p>}
      {message && <p className="admin-message">{message}</p>}

      <button
        type="button"
        className="admin-submit bulk-register-button"
        onClick={handleRegister}
        disabled={!canRegister}
      >
        {saving
          ? "대량등록 중..."
          : rows.length > 0
            ? `${rows.length}개 매물 전체 등록`
            : "엑셀 파일을 먼저 선택하세요"}
      </button>

      <style jsx>{`
        .bulk-upload-panel {
          padding: 22px;
          border: 1px solid #dddddd;
          background: #ffffff;
        }

        .bulk-guide {
          padding: 16px;
          border: 1px solid #e0e0e0;
          background: #f8f8f8;
        }

        .bulk-guide strong {
          display: block;
          margin-bottom: 7px;
          font-size: 16px;
        }

        .bulk-guide p {
          margin: 0;
          color: #555555;
          line-height: 1.7;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .bulk-template-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border: 1px solid #222222;
          background: #ffffff;
          color: #222222;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .bulk-drop-zone {
          display: flex;
          min-height: 210px;
          margin-top: 14px;
          padding: 28px 20px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 2px dashed #bbbbbb;
          background: #fafafa;
          text-align: center;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            background 0.15s ease,
            transform 0.15s ease;
        }

        .bulk-drop-zone:hover,
        .bulk-drop-zone.dragging {
          border-color: #222222;
          background: #f1f1f1;
        }

        .bulk-drop-zone.dragging {
          transform: scale(1.01);
        }

        .bulk-drop-icon {
          margin-bottom: 8px;
          font-size: 38px;
          line-height: 1;
        }

        .bulk-drop-zone strong {
          font-size: 17px;
        }

        .bulk-drop-zone span {
          margin-top: 7px;
          color: #777777;
          font-size: 14px;
        }

        .bulk-selected-file {
          margin-top: 16px;
          padding: 9px 12px;
          border: 1px solid #dddddd;
          background: #ffffff;
          color: #333333;
          font-size: 14px;
        }

        .bulk-error-box {
          margin-top: 18px;
          padding: 16px;
          border: 1px solid #e35b5b;
          background: #fff5f5;
          color: #a82222;
        }

        .bulk-error-box ul {
          margin: 10px 0 0;
          padding-left: 20px;
          line-height: 1.7;
        }

        .bulk-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .bulk-summary span {
          color: #777777;
          font-size: 13px;
        }

        .bulk-table-wrap {
          overflow-x: auto;
          border: 1px solid #dddddd;
        }

        .bulk-table {
          width: 100%;
          min-width: 820px;
          border-collapse: collapse;
        }

        .bulk-table th,
        .bulk-table td {
          padding: 11px 12px;
          border-bottom: 1px solid #e5e5e5;
          text-align: left;
          font-size: 14px;
        }

        .bulk-table th {
          background: #f5f5f5;
          font-weight: 700;
        }

        .bulk-register-button {
          margin-top: 20px;
          min-width: 220px;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        @media (max-width: 700px) {
          .bulk-upload-panel {
            padding: 14px;
          }

          .bulk-actions,
          .bulk-summary {
            align-items: stretch;
            flex-direction: column;
          }

          .bulk-template-button,
          .bulk-register-button {
            width: 100%;
          }

          .bulk-drop-zone {
            min-height: 180px;
          }
        }
      `}</style>
    </section>
  );
}
