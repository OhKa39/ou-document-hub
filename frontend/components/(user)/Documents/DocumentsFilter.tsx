import React from 'react';
import filter from '@/public/Filter.svg';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import categories from '@/__mocks__/data/categories';

const DocumentsFilter = () => {
  return (
    <div className="flex h-fit min-w-[262px] flex-col gap-8">
      {/* header */}
      <div className="flex items-center gap-2">
        <Image alt="filter" src={filter} className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Bộ lọc</h1>
      </div>
      {/* Category sectio */}
      <div className="h-[255px] space-y-2 overflow-y-auto">
        <h1 className="text-xl font-bold uppercase">Ngành học</h1>
        <RadioGroup className="space-y-2 font-semibold text-[#807E7E]">
          {categories.map((category) => (
            <div className="flex space-x-2" key={category.id}>
              <RadioGroupItem value={category.categoryName} id={category.categoryName} />
              <Label htmlFor={category.categoryName}>{category.categoryName}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default DocumentsFilter;
