"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/pet-ui";

export function LogoutButton() {
  const router = useRouter();
  const { copy, locale } = useI18n();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <Button
      type="button"
      onClick={logout}
      disabled={loading}
      variant="secondary"
      className="min-h-9 px-3 py-1.5"
    >
      {loading ? (locale === "vi" ? "Đang đăng xuất..." : "Signing out...") : copy.common.signOut}
    </Button>
  );
}
