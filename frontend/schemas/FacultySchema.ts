import NormalizeSpace from '@/utils/NormalizeSpace';
import { z } from 'zod';

const FacultySchema = z.object({
  facultyName: z
    .string()
    .transform(value=> NormalizeSpace(value))
    .pipe(z.string()
    .min(1, 'Ngành học không được để trống')
    .max(100, 'Ngành học chỉ được tối đa 100 ký tự'))
,
});

export default FacultySchema;
