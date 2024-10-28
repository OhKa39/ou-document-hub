import { CART_PROCESS_OPTIONS } from '@/constants';
import { z } from 'zod';

// const array: string[] = CART_PROCESS_OPTIONS.map((item) => item.value);

export const CartProcessSchema = z.object({
  type: z.string(),
});
