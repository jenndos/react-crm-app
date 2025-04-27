// Optimized

import React from "react";

interface Participant {
  id: number;
  name: string;
  surname: string;
  position: string;
  email: string;
  phone: string;
  city: string;
  birth_date: string;
}

const ParticipantCard: React.FC<{ participant: Participant }> = ({ participant }) => {
  const initials = `${participant.name[0] || ''}${participant.surname[0] || ''}`;
  const fields = [
    { label: "Должность:", value: participant.position },
    { label: "Email:", value: participant.email },
    { label: "Телефон:", value: participant.phone },
    { label: "Город:", value: participant.city },
    { label: "Дата рождения:", value: participant.birth_date },
  ];

  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-4 md:p-12 min-w-[380px]">
      <div className="flex items-center justify-evenly w-full">
        {/* Profile section */}
        <div className="flex flex-col mr-10 items-center justify-center">
          <div className="w-25 h-25 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-gray-500 font-medium text-xl">
              {initials || '?'}
            </span>
          </div>
          <h3 className="font-semibold text-center">
            {participant.name} {participant.surname}
          </h3>
        </div>

        {/* Details section */}
        <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-7">
          {fields.map((field) => (
            <React.Fragment key={field.label}>
              <span className="text-gray-500">{field.label}</span>
              <span className="break-words">{field.value || '-'}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ParticipantCard);