export type ReviewRow = {
  id: number;
  title: string;
  content: string;
  author: string | null;
  thumbnail_url: string;
  image_urls: string[] | null;
  status: "공개" | "숨김";
  created_at: string;
  is_best: boolean;
};
