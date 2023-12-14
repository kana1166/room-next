// pages/signup.tsx

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUser } from "../utils/api";

interface LoginForm {
  username: string;
  password: string;
  email: string;
  role?: string; // roleをオプショナルとして扱う
}

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      role: "一般", // ここでデフォルト値を設定
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await createUser(data);
      console.log(response); // 新規登録のレスポンスを処理
      // 新規登録成功後のリダイレクトなどの処理
    } catch (error) {
      console.error(error);
      // エラーハンドリング
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("username", { required: true })}
        placeholder="Username"
      />
      {errors.username && <p>Username is required</p>}

      <input
        {...register("password", { required: true })}
        placeholder="Password"
        type="password"
      />
      {errors.password && <p>Password is required</p>}

      <input
        {...register("email", { required: true })}
        placeholder="Email"
        type="email"
      />
      {errors.email && <p>Email is required</p>}

      {/* roleフィールドはユーザーに見えないようにします */}
      <input type="hidden" {...register("role")} />

      <button type="submit">Sign up</button>
    </form>
  );
}
