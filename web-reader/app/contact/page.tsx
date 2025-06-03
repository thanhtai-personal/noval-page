"use client";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

export default function ContactPage() {
  return (
    <section className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Liên hệ</h1>
      <p className="text-gray-600">
        Nếu bạn có thắc mắc hoặc góp ý, vui lòng để lại thông tin bên dưới.
      </p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input isRequired label="Họ tên" placeholder="Tên của bạn" />
        <Input
          isRequired
          label="Email"
          placeholder="Email của bạn"
          type="email"
        />
        <Textarea
          isRequired
          label="Nội dung"
          minRows={5}
          placeholder="Nội dung liên hệ..."
        />
        <Button color="primary" type="submit">
          Gửi
        </Button>
      </form>
    </section>
  );
}
