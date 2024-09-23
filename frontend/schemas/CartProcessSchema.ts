import { z } from 'zod';

const options = [
  {
    id: 1,
    name: 'Free shipping',
    value: 'test1',
  },
  {
    id: 2,
    name: 'Express shipping',
    value: 'test2',
  },
  {
    id: 3,
    name: 'Pick up',
    value: 'test3',
  },
];

export const CartProcessSchema = z.object({
  type: z.enum(
    options.map((item) => item.value),
    {
      required_error: 'You need to select a notification type.',
    }
  ),
});
