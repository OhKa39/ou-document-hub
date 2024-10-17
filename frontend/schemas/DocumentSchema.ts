import NormalizeSpace from '@/utils/NormalizeSpace';
import { z } from 'zod';

const myUnion = z.discriminatedUnion('documentType', [
  z.object({
    documentType: z.literal('Online'),
    onlineFile: z.instanceof(File).refine((file) => file.size <= 50000000, {
      message: 'Tệp tin tài liệu không được để trống và  phải < 50 MB',
    }),
  }),
  z.object({
    documentType: z.literal('Paper'),
    stock: z.number().int().positive({
      message: 'Số lượng tồn kho phải > 0',
    }),
    shippingAddresses: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'Bạn phải chọn ít nhất 1 cơ sở vận chuyển',
    }),
  }),
]);

const DocumentSchema = z
  .object({
    image: z.instanceof(File).refine((file) => file.size <= 5000000 && file.size >= 0, {
      message: 'Hình ảnh không được để trồng và nhỏ hơn 5 MB',
    }),
    name: z
      .string()
      .transform((value) => NormalizeSpace(value))
      .pipe(
        z.string().min(2, {
          message: 'Tên tài liệu phải ít nhất 2 ký tự',
        })
      ),
    description: z
      .string()
      .transform((value) => NormalizeSpace(value))
      .pipe(
        z.string().min(10, {
          message: 'Mô tả tài liệu phải ít nhất 10 ký tự',
        })
      ),
    price: z.number().nonnegative({
      message: 'Gía tài liệu phải > 0',
    }),
    faculty: z.string({
      required_error: 'Ngành học không được để trồng',
    }),
  })
  .and(myUnion);

export default DocumentSchema;
