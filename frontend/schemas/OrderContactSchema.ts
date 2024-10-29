import { z } from 'zod';

const OrderContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),

  paymentMethod: z.enum(['money', 'online banking']),
});
export default OrderContactSchema;
