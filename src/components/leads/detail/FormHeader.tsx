
import React from 'react';

interface FormHeaderProps {
  ownerName: string;
  propertyAddress: string;
}

export function FormHeader({ ownerName, propertyAddress }: FormHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{ownerName}</h1>
      <p className="text-gray-600 mt-1">{propertyAddress}</p>
    </div>
  );
}
