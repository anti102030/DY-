export type ConsultationRow = {
  id: number;
  name: string | null;
  phone: string;
  message: string;
  status: "신규" | "상담중" | "완료";
  source: string | null;
  created_at: string;
};
