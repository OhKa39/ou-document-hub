import NormalizeSpace from '@/utils/NormalizeSpace';
import { z } from 'zod';

const ShippingAddressSchema = z.object({
  shippingAddressName: z
    .string()
    .transform((value) => NormalizeSpace(value))
    .pipe(z.string().min(1, 'Tên cơ sở không được để trống').max(100, 'Tên cơ sở chỉ được tối đa 100 ký tự')),
});

export default ShippingAddressSchema;
