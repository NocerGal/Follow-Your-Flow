import { NewPartner } from '@/app/flow/new/FormCreateFlow';
import { Cross2Icon } from '@radix-ui/react-icons';
import React from 'react';

type TagProps = {
  children: string;
  onClickDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    partnerId: string
  ) => void;
} & Omit<NewPartner, 'partner'>;

export default function Tag({ children, onClickDelete, id }: TagProps) {
  return (
    <span className="flex items-center w-fit gap-2 px-2 py-1 bg-foreground text-primary-foreground rounded-lg">
      {children}
      <button onClick={(e) => onClickDelete(e, id)}>
        <Cross2Icon className="cursor-pointer" height={20} />
      </button>
    </span>
  );
}
