import { UpdateIcon } from '@radix-ui/react-icons';
import React from 'react';

export default function Loading() {
  return (
    <div className="mx-auto my-auto">
      <UpdateIcon className="animate-spin" />
    </div>
  );
}
