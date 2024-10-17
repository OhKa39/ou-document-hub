import { nameValidation, OLDEST, passwordValidation, YOUNGEST } from '@/constants';
import { z } from 'zod';

export const SignUpSchema: any = z
  .object({
    lastName: z
      .string()
      .min(1, { message: 'Họ phải tối thiểu 1 ký tự' })
      .max(40, { message: 'Họ chỉ tối đa 40 ký tự' })
      .regex(nameValidation, { message: 'Họ không hợp lê' })
      .trim(),
    firstName: z
      .string()
      .min(1, { message: 'Tên phải tối thiểu 1 ký tự' })
      .max(40, { message: 'Tên chỉ tối đa 40 ký tự' })
      .regex(nameValidation, { message: 'Tên không hợp lệ' })
      .trim(),
    email: z.string().email({ message: 'Email không đúng định dạng' }).trim(),
    password: z
      .string()
      .min(8, {
        message: 'Mật khẩu phải có ít nhất 8 ký tự',
      })
      .regex(passwordValidation, {
        message: 'Mật khẩu phải chứa ít nhất 1 kí tự hoa, 1 kí tự đặc biệt, 1 kí tự thường và 1 kí tự chữ số',
      }),
    confirmPassword: z.string(),
    dateOfBirth: z.date().refine(
      (date) => {
        return (
          new Date().getFullYear() - date.getFullYear() >= YOUNGEST &&
          new Date().getFullYear() - date.getFullYear() <= OLDEST
        );
      },
      { message: 'Năm sinh không hợp lệ' }
    ),
    gender: z.enum(['Male', 'Female', 'Other'], { message: 'Giới tính không hợp lệ' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Xác nhận mật khẩu không trùng khớp',
    path: ['confirmPassword'],
  });
