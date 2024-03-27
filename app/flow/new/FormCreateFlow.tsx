'use client';

import React, { useRef, useState } from 'react';
import Tag from '@/src/components/ui/tag';
import { queryUserIdByUserName } from './user.query';
import { NewStepType, actionCreateFlow, actionCreateStep } from './flow.action';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export type NewPartner = {
  partner: string;
  id: string;
};
export type NewManager = {
  manager: string;
  id: string;
};

export default function FormCreateFlow() {
  const [partners, setPartners] = useState<NewPartner[]>([]);
  const [managers, setManagers] = useState<NewManager[]>([]);
  const [steps, setSteps] = useState<NewStepType[]>([]);
  const [errorPartner, setErrorPartner] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const [flowId, setFlowId] = useState<string>();

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
  const handleAddManager = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newManager =
        e.currentTarget.value.charAt(0).toUpperCase() +
        e.currentTarget.value.slice(1).toLowerCase();
      if (newManager === '') return;
      // Si newPartner existe déjà dans le tableau partner alors return
      if (managers.some((partnerObj) => partnerObj.manager === newManager)) {
        return;
      } else {
        const userDatas = await queryUserIdByUserName(newManager);
        // Si name n'existe pas, alors n'ajoute pas l'utilisateur dans le tableau.
        setErrorPartner(true);
        if (!userDatas) return;
        setManagers((prev) => [
          ...prev,
          { manager: newManager, id: userDatas.id },
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
    setPartners((prev) => prev.filter((partner) => partner.id !== partnerId));
  };

  const handleDeleteManager = (
    e: React.MouseEvent<HTMLButtonElement>,
    partnerId: string
  ) => {
    e.preventDefault();
    setManagers((prev) => prev.filter((manager) => manager.id !== partnerId));
  };

  const handleSubmitFormCreateFlow = async (e: FormData) => {
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
    const flowId = await actionCreateFlow(flowDatas);

    setFlowId(flowId.id);
    setFormPage((prev) => prev + 1);
  };

  const handleSubmitCreateSteps = async (e: FormData) => {
    const stepTitle = e.get('stepTitle')?.toString();
    const stepDescription = e.get('stepDescription')?.toString();

    if (flowId == undefined || stepTitle == null || stepDescription == null) {
      throw new Error('miss datas');
    }

    const flowDatas = {
      title: stepTitle,
      description: stepDescription,
      userIds: managers,
      status: 'MANAGER',
      flowId,
    };

    const newStep = await actionCreateStep(flowDatas);

    setSteps((prev) => [...prev, newStep]);
  };

  {
    return formPage == 1 ? (
      <form className="w-3/4" action={(e) => handleSubmitFormCreateFlow(e)}>
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
    ) : (
      <div className="flex flex-col gap-8 w-3/4">
        <form action={(e) => handleSubmitCreateSteps(e)}>
          <fieldset className="flex flex-col gap-2 border-none">
            <label htmlFor="stepTitle" className="flex flex-col gap-2">
              Step title
              <input
                id="stepTitle"
                name="stepTitle"
                type="text"
                className="px-3 py-1 bg-input rounded-lg outline-ring w-full"
              />
            </label>
            <label htmlFor="stepDescription" className="flex flex-col gap-2">
              Step description
              <input
                id="stepDescription"
                name="stepDescription"
                type="text"
                className="px-3 py-1 bg-input rounded-lg outline-ring"
              />
            </label>
            <div className="flex flex-col gap-2">
              <label htmlFor="stepManager" className="mb-5">
                Add step managers
                <div className="flex flex-col gap-2">
                  <ul className="flex flex-wrap gap-2">
                    {managers.map((partner) => (
                      <li key={partner.id}>
                        <Tag
                          onClickDelete={handleDeleteManager}
                          id={partner.id}
                        >
                          {partner.manager}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                  <input
                    ref={inputRef}
                    onKeyDown={handleAddManager}
                    id="stepManager"
                    name="stepManager"
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
            <div className="flex gap-2">
              <button
                className="flex justify-center rounded-md bg-card-foreground w-fit px-2 py-1 text-primary-foreground"
                type="submit"
              >
                Create
              </button>
              <Link
                href="/"
                className="flex items-center gap-1 justify-center rounded-md bg-card-foreground w-fit px-2 py-1 text-primary-foreground"
              >
                Next <ArrowRightIcon />
              </Link>
            </div>
          </fieldset>
        </form>
        <div>
          <h2>Your steps</h2>
          <ul>
            {steps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
