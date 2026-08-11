"use client";

export default function AdminLogoutButton() {
  async function handleLogout() {
    try {
      await fetch(
        "/api/admin-auth/logout",
        {
          method: "POST",
          credentials: "include",
        },
      );
    } finally {
      window.location.href = "/admin-login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="admin-logout-button"
    >
      관리자 로그아웃
    </button>
  );
}
