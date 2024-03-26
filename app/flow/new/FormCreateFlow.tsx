'use client';

import React, { useRef, useState } from 'react';
import Tag from '@/src/components/ui/tag';
import { queryUserIdByUserName } from './user.query';
import { actionCreateFlow } from './user.action';

export type NewPartner = {
  partner: string;
  id: string;
};

export default function FormCreateFlow() {
  const [partners, setPartners] = useState<NewPartner[]>([]);
  const [errorPartner, setErrorPartner] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddPartner = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newPartner =
        e.currentTarget.value.charAt(0).toUpperCase() +
        e.currentTarget.value.slice(1).toLowerCase();
      if (newPartner === '') return;
      // Si newPartner existe déjà dans le tableau partner alors return
      if (partners.some((partnerObj) => partnerObj.partner === newPartner)) {
        return;
      } else {
        const userDatas = await queryUserIdByUserName(newPartner);
        // Si name n'existe pas, alors n'ajoute pas l'utilisateur dans le tableau.
        setErrorPartner(true);
        if (!userDatas) return;
        setPartners((prev) => [
          ...prev,
          { partner: newPartner, id: userDatas.id },
        ]);
        setErrorPartner(false);
        if (inputRef.current) inputRef.current.value = '';
      }
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

  const handleSubmitForm = async (e: FormData) => {
    const flowTitle = e.get('flowTitle')?.toString();
    const flowDescription = e.get('flowDescription')?.toString();
    if (flowTitle == null || flowDescription == null) {
      throw new Error('miss datas');
    }
    const flowDatas = {
      title: flowTitle,
      description: flowDescription,
      userIds: partners,
    };
    await actionCreateFlow(flowDatas);
  };

  return (
    <form className="w-3/4" action={(e) => handleSubmitForm(e)}>
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
        <div className="flex flex-col gap-2">
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
              {errorPartner && (
                <span className="text-destructive">
                  This user doesn&apos;t exist
                </span>
              )}
            </div>
          </label>
        </div>
        <button
          className="flex justify-center rounded-md bg-card-foreground w-fit px-2 py-1 text-primary-foreground"
          type="submit"
        >
          Submit
        </button>
      </fieldset>
    </form>
  );
}
