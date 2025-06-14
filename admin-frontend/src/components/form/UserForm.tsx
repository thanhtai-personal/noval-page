import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/i18n";

interface UserFormProps {
  mode?: "create" | "edit";
  defaultData?: any; // user object
  onSuccess?: () => void;
}

export function UserForm({
  mode = "create",
  defaultData,
  onSuccess,
}: UserFormProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState(defaultData?.email || "");
  const [name, setName] = useState(defaultData?.name || "");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(defaultData?.role?._id || "");
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    const res = await api.get("/roles");
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    if (!email || !roleId || (mode === "create" && !password)) {
      alert(t("userform.required"));
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit") {
        await api.patch(`/users/${defaultData._id}`, {
          email,
          name,
          role: roleId,
        });
        alert(t("userform.update_success"));
      } else {
        await api.post("/users", {
          email,
          name,
          password,
          role: roleId,
        });
        alert(t("userform.create_success"));
        // Reset form nếu tạo
        setEmail("");
        setName("");
        setPassword("");
        setRoleId("");
      }

      onSuccess?.();
    } catch (err: any) {
      alert(err?.response?.data?.message || t("userform.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-black">
      {loading ? (
        <div className="animate-pulse w-full h-10 bg-gray-200 rounded mb-4" />
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <Label>{t("userform.email")}</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("userform.email_placeholder")}
            />
          </div>

          <div>
            <Label>{t("userform.name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("userform.name_placeholder")}
            />
          </div>

          {mode === "create" && (
            <div>
              <Label>{t("userform.password")}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("userform.password_placeholder")}
              />
            </div>
          )}

          <div>
            <Label>{t("userform.role")}</Label>
            <Select value={roleId} onValueChange={(value) => setRoleId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("userform.role_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r: any) => (
                  <SelectItem key={r._id} value={r._id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? mode === "edit"
                ? t("userform.updating")
                : t("userform.creating")
              : mode === "edit"
              ? t("userform.update")
              : t("userform.create")}
          </Button>
        </form>
      )}
    </div>
  );
}
