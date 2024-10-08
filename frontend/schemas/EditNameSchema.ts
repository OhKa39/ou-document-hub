import { nameValidation } from '@/constants';
import React from 'react';
import { z } from 'zod';

const EditNameSchema = z.object({
  lastName: z
    .string()
    .min(1, { message: 'Họ phải tối thiểu 1 ký tự' })
    .max(40, { message: 'Họ chỉ tối đa 40 ký tự' })
    .regex(nameValidation, { message: 'Họ không hợp lê' }),
  firstName: z
    .string()
    .min(1, { message: 'Tên phải tối thiểu 1 ký tự' })
    .max(40, { message: 'Tên chỉ tối đa 40 ký tự' })
    .regex(nameValidation, { message: 'Tên không hợp lệ' }),
});

export default EditNameSchema;
