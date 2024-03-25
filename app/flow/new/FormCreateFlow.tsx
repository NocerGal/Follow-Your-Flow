'use client';
import React, { useRef, useState } from 'react';
import Tag from '@/src/components/ui/tag';
import { randomUUID } from 'crypto';

export type NewPartner = {
  partner: string;
  id: string;
};

export default function FormCreateFlow() {
  const [partners, setPartners] = useState<NewPartner[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddPartner = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newPartner = e.currentTarget.value;
      if (newPartner === '') return;
      const newUuid = self.crypto.randomUUID();
      setPartners((prev) => [...prev, { partner: newPartner, id: newUuid }]);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDeletePartner = (
    e: React.MouseEvent<HTMLButtonElement>,
    partnerId: string
  ) => {
    e.preventDefault();

    setPartners((prev) =>
      prev.filter((testPartner) => testPartner.id !== partnerId)
    );
  };

  return (
    <form className="w-3/4">
      <fieldset className="flex flex-col gap-2 border-none">
        <label htmlFor="flowTitle" className="flex flex-col gap-2">
          Flow title
          <input
            id="flowTitle"
            name="flowTitle"
            type="text"
            className="px-3 py-1 bg-input rounded-lg outline-ring w-full"
          />
        </label>
        <label htmlFor="flowDescription" className="flex flex-col gap-2">
          Flow description
          <input
            id="flowDescription"
            name="flowDescription"
            type="text"
            className="px-3 py-1 bg-input rounded-lg outline-ring"
          />
        </label>
        <div>
          <label htmlFor="addPartners" className="mb-5">
            Add partners
            <div className="flex flex-col gap-2">
              <ul className="flex flex-wrap gap-2">
                {partners.map((partner) => (
                  <li key={partner.id}>
                    <Tag onClickDelete={handleDeletePartner} id={partner.id}>
                      {partner.partner}
                    </Tag>
                  </li>
                ))}
              </ul>
              <input
                ref={inputRef}
                onKeyDown={handleAddPartner}
                id="addPartners"
                name="addPartners"
                type="text"
                className="w-full px-3 py-1 bg-input rounded-lg outline-ring"
              />
            </div>
          </label>
        </div>
      </fieldset>
    </form>
  );
}
