'use client';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { HiMiniMinus } from 'react-icons/hi2';
import { IoAddSharp } from 'react-icons/io5';

const MinusButton = () => {
  const [value, setValue] = useState(0);
  const handleIncrement = () => {
    setValue(value + 1);
  };
  const handleDecrement = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };
  return (
    <div className="relative m-auto flex h-full w-full rounded-sm border-[1px] border-[#6c7275]">
      <HiMiniMinus className="absolute left-0 h-full w-[33%] cursor-pointer" onClick={handleDecrement} />
      <Input
        className="!b-0 absolute left-1/2 !m-0 h-full w-[33%] -translate-x-1/2 !p-0 !text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value) || 0)}
        min={0}
      />
      <IoAddSharp
        className="absolute left-1/2 h-full w-[33%] translate-x-1/2 cursor-pointer"
        onClick={handleIncrement}
      />
    </div>
  );
};

export default MinusButton;
