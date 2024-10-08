import { nameValidation, OLDEST, passwordValidation, YOUNGEST } from '@/constants';
import { z } from 'zod';
import { GENDER } from '@/constants';

const EditGenderSchema: any = z.object({
  gender: z.enum(GENDER as [string, ...string[]], { message: 'Giới tính không hợp lệ' }),
});

export default EditGenderSchema;
