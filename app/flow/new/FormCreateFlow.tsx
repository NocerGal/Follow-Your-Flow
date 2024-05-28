'use client';

import React, { useState, useRef } from 'react';
import Tag from '@/src/components/ui/tag';
import { queryUserByUserName } from './user.query';
import {
  ManagersType,
  NewStepType,
  actionCreateFlow,
  actionCreateStep,
} from './flow.action';
import { ArrowRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
  const [managers, setManagers] = useState<ManagersType>([]);
  const [changingManagers, setChangingManagers] = useState<NewManager[]>([]);
  const [steps, setSteps] = useState<NewStepType[]>([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorAddManagerMessage, setErrorAddManagerMessage] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const [flowId, setFlowId] = useState<string>();
  const [stepTitle, setStepTitle] = useState('');
  const [changingTitle, setChangingTitle] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [isModifyingStep, setIsModifyingStep] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const formStepRef = useRef<HTMLFormElement>(null);

  const handleAddPartner = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newPartner =
        e.currentTarget.value.charAt(0).toUpperCase() +
        e.currentTarget.value.slice(1).toLowerCase();
      if (newPartner === '') return;
      if (partners.some((partnerObj) => partnerObj.partner === newPartner)) {
        return;
      } else {
        const userDatas = await queryUserByUserName(newPartner);
        if (!userDatas) {
          setErrorMessage(true);
          return;
        }
        setPartners((prev) => [
          ...prev,
          { partner: newPartner, id: userDatas.userId },
        ]);
        setErrorMessage(false);
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
      if (managers.some((partnerObj) => partnerObj.user.name === newManager)) {
        return;
      } else {
        const userDatas = await queryUserByUserName(newManager);
        if (!userDatas || !userDatas.user === null) {
          setErrorMessage(true);
          return;
        }

        setManagers((prev) => [...prev, userDatas]);
        setErrorMessage(false);
        setErrorAddManagerMessage(false);
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
    setManagers((prev) =>
      prev.filter((manager) => manager.userId !== partnerId)
    );
  };

  const handleDeleteStep = (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    stepId: string
  ) => {
    e.preventDefault();
    setStepTitle('');
    setStepDescription('');
    setManagers([]);
    setSteps((prev) => prev.filter((step) => step.createStep.id !== stepId));
  };

  const handleSubmitFormCreateFlow = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const flowTitle = new FormData(e.currentTarget)
      .get('flowTitle')
      ?.toString();
    const flowDescription = new FormData(e.currentTarget)
      .get('flowDescription')
      ?.toString();
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
    setErrorMessage(false);
    setFormPage((prev) => prev + 1);
  };

  const handleSubmitCreateSteps = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stepTitle = formData.get('stepTitle')?.toString();
    const stepDescription = formData.get('stepDescription')?.toString();

    if (isModifyingStep) {
      setIsModifyingStep(false);
      setStepTitle('');
      setStepDescription('');
      return;
    }

    if (
      flowId == undefined ||
      stepTitle == null ||
      stepDescription == null ||
      managers.length === 0
    ) {
      setErrorAddManagerMessage(true);
      return;
    }

    const flowDatas = {
      title: stepTitle,
      description: stepDescription,
      managers,
      status: 'MANAGER',
      flowId: flowId,
    };

    const newStep = await actionCreateStep(flowDatas);
    setSteps((prev) => [...prev, newStep]);
    setStepTitle('');
    setStepDescription('');
    setManagers([]);
  };

  const startModifyStep = (stepId: string) => {
    setIsModifyingStep(true);
    const indexStepToModify = steps.findIndex(
      (step) => stepId === step.createStep.id
    );

    const managersBis: NewManager[] = steps[indexStepToModify].managers
      .filter((manager) => manager.user.name !== null)
      .map((manager) => ({
        id: manager.user.id,
        manager: manager.user.name as string,
      }));

    setChangingManagers(managersBis);
    setChangingTitle(steps[indexStepToModify].createStep.title);
    setStepTitle(steps[indexStepToModify].createStep.title);
    setStepDescription(steps[indexStepToModify].createStep.description);

    const managers = [] as ManagersType;
    steps[indexStepToModify].managers.forEach((manager) => {
      if (manager.user.name == null || manager.user.id == null) return;
      managers.push(manager);
    });
    setManagers(managers);
  };

  const handleModifyStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const stepIndex = steps.findIndex(
      (title) => changingTitle === title.createStep.title
    );

    const selectedManagerIds = managers.map((manager) => manager);
    const filteredManagerList = steps[stepIndex].managers.filter((manager) =>
      selectedManagerIds.includes(manager)
    );

    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === stepIndex
          ? {
              ...step,

              createStep: {
                ...step.createStep,
                title: stepTitle,
                description: stepDescription,
              },
              managers: filteredManagerList,
            }
          : step
      )
    );
    setStepTitle('');
    setStepDescription('');
    setManagers([]);
    setIsModifyingStep(false);
  };

  return formPage === 1 ? (
    <form className="w-3/4" onSubmit={handleSubmitFormCreateFlow}>
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
              {errorMessage && (
                <span className="text-destructive">
                  This user doesn&apos;t exist
                </span>
              )}
            </div>
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <button
            disabled={partners.length === 0}
            className="flex justify-center rounded-md bg-card-foreground w-fit px-2 py-1 text-primary-foreground"
            type="submit"
          >
            Submit
          </button>
          {partners.length === 0 && (
            <span>Add at least one partner to create a flow</span>
          )}
        </div>
      </fieldset>
    </form>
  ) : (
    <div className="flex flex-col gap-8 w-3/4">
      <form
        onSubmit={isModifyingStep ? handleModifyStep : handleSubmitCreateSteps}
        ref={formStepRef}
      >
        <fieldset className="flex flex-col gap-2 border-none">
          <label htmlFor="stepTitle" className="flex flex-col gap-2">
            Step title
            <input
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
              id="stepTitle"
              name="stepTitle"
              type="text"
              className="px-3 py-1 bg-input rounded-lg outline-ring w-full"
            />
          </label>
          <label htmlFor="stepDescription" className="flex flex-col gap-2">
            Step description
            <input
              value={stepDescription}
              onChange={(e) => setStepDescription(e.target.value)}
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
                    <li key={partner.user.name}>
                      <Tag
                        onClickDelete={handleDeleteManager}
                        id={partner.userId}
                      >
                        {partner.user.name!}
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
                {errorMessage && (
                  <span className="text-destructive">
                    This user doesn&apos;t exist
                  </span>
                )}
                {errorAddManagerMessage && (
                  <span className="text-destructive">
                    Add at least one manager to create a step
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
              {isModifyingStep ? 'Save changes' : 'Add step'}
            </button>
            <Link
              href="/link"
              aria-disabled={true}
              tabIndex={true ? -1 : undefined}
              className={`flex items-center gap-1 justify-center rounded-md bg-card-foreground w-fit px-2 py-1 text-primary-foreground ${
                steps.length === 0 && 'pointer-events-none'
              }`}
            >
              Next <ArrowRightIcon />
            </Link>
          </div>
        </fieldset>
      </form>
      <div>
        <h2 className="mb-4">Your steps</h2>
        <ul className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <li key={index}>
              <Card className="relative">
                <Cross1Icon
                  onClick={(e) => handleDeleteStep(e, step.createStep.id)}
                  className="absolute top-0 right-0 m-4 cursor-pointer"
                />
                <CardHeader>
                  <CardTitle>{step.createStep.title}</CardTitle>
                  <CardDescription>
                    {step.createStep.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <div className="flex items-center mb-4">
                    <h3 className="mr-2">Managers : </h3>
                    <ul className="flex">
                      {step.managers.map((manager, index) => (
                        <li key={manager.user.id} className="mr-2">
                          {manager.user.name}
                          {index === step.managers.length - 1 ? '.' : ','}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => startModifyStep(step.createStep.id)}>
                    Modify
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
