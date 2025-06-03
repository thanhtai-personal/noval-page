"use client";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <section className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-gray-600">{t("desc")}</p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          isRequired
          label={t("name")}
          placeholder={t("name_placeholder")}
        />
        <Input
          isRequired
          label={t("email")}
          placeholder={t("email_placeholder")}
          type="email"
        />
        <Textarea
          isRequired
          label={t("content")}
          minRows={5}
          placeholder={t("content_placeholder")}
        />
        <Button color="primary" type="submit">
          {t("send")}
        </Button>
      </form>
    </section>
  );
}
