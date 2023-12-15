// pages/login.tsx
import { useState, FormEvent } from "react";
import Router from "next/router";

export default function Login() {
  const [employee_number, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ヘッダーをapplication/jsonに変更
        },
        body: JSON.stringify({
          employee_number, // 直接オブジェクトを渡す
          password, // 直接オブジェクトを渡す
        }),
      });

      if (!response.ok) {
        throw new Error(
          "ログインに失敗しました。ゲストの方はゲストログインをお試しください"
        );
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);

      // トークンをデコードして役割を取得
      const payload = data.access_token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log("Decoded JWT Payload:", decodedPayload);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", decodedPayload.role);

      // 役割に応じたリダイレクト
      if (decodedPayload.role === "役員" || decodedPayload.role === "管理者") {
        Router.push("/officer");
      } else {
        Router.push("/staffPage");
      }
    } catch (err) {
      // エラー処理
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました。");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="employeeNumber">社員番号:</label>
          <input
            type="text"
            id="employeeNumber"
            value={employee_number}
            onChange={(e) => setEmployeeNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}
