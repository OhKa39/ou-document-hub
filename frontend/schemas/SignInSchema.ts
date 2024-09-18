import {z} from "zod";

export const SignInSchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng' }),
  password: z.string().min(1, {
        message: 'Mật khẩu không được để trống',
      }),
});
