import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { PropertyRow } from "@/lib/propertyTypes";
import EditPropertyForm from "@/components/EditPropertyForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;

  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    notFound();
  }

  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (error || !data) {
    notFound();
  }

  const property = data as PropertyRow;

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>매물 수정</h1>

          <p>
            등록된 매물 정보를 수정할 수 있습니다.
          </p>
        </div>

        <Link
          href="/admin/properties"
          className="admin-back-button"
        >
          목록으로
        </Link>
      </div>

      <EditPropertyForm property={property} />

      <style>{`
        .admin-page {
          width: 100%;
          box-sizing: border-box;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-header h1 {
          margin: 0;
          color: #222;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .admin-header p {
          margin: 8px 0 0;
          color: #777;
          font-size: 14px;
        }

        .admin-back-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 100px;
          min-height: 42px;
          padding: 0 18px;

          border: 1px solid #ccc;
          border-radius: 5px;

          background: #fff;
          color: #333;

          font-size: 13px;
          font-weight: 800;
          text-decoration: none;

          box-sizing: border-box;
        }

        @media (max-width: 650px) {
          .admin-header {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}