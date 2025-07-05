"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { ApiInstant } from "@/utils/api";
import { useRouter } from "next/navigation";

function ChangePasswordPageContent() {
  const t = useTranslations("changePassword");
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiInstant.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      router.back();
    } catch (err) {
      console.error("change password error", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          isRequired
          label={t("current_password")}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          isRequired
          label={t("new_password")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button color="primary" role="button" type="submit">
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}

export default ChangePasswordPageContent;
