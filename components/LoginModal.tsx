"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { login } from "../src/lib/api";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (access: string, refresh: string) => void;
}

export function LoginModal({
  isOpen,
  onOpenChange,
  onLoginSuccess,
}: LoginModalProps) {
  const [username, setUsername] = useState("admin1");
  const [password, setPassword] = useState("123321Hoang");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Đang thử đăng nhập với:", { username });
      const response = await login(username, password);
      if (!response || !response.access) {
        throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
      console.log("Kết quả đăng nhập:", response);
      onLoginSuccess(response.access, response.refresh);
      setUsername("admin1"); // Đặt lại giá trị mặc định
      setPassword("123321Hoang"); // Đặt lại giá trị mặc định
      setLoginError(null);
      onOpenChange(false);
      alert(
        "Đăng nhập thành công! - " +
          new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      );
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err.message);
      setLoginError(err.message);
      alert("Lỗi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động đăng nhập khi modal mở
  useEffect(() => {
    if (isOpen && username && password && !isLoading) {
      handleLogin();
    }
  }, [isOpen, username, password, isLoading]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        console.log("Trạng thái mở dialog thay đổi:", open);
        onOpenChange(open);
      }}
    >
      <DialogContent aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle>Đăng nhập</DialogTitle>
        </DialogHeader>
        <div className="space-y-4" id="login-description">
          <Input
            autoFocus
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
          {loginError && <p className="text-red-500">{loginError}</p>}
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
