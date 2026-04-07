import React, { useEffect } from "react";
import { useClient } from "../../hooks/useClient";
import { ValuePicker } from "./ValuePickerModal";

interface SelectClientProps {
  selectedValue?: string;
  onSelect: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function SelectClient({ 
  selectedValue, 
  onSelect, 
  error,
  label = "Select Client",
  required = false,
  className
}: SelectClientProps) {
  const { clients, getAllClients } = useClient();

  useEffect(() => {
    getAllClients();
  }, []);

  const options = clients.map((client: any) => ({
    label: client.name,
    value: client._id || client.id,
    description: client.mobile || undefined,
  }));

  return (
    <ValuePicker
      label={label}
      required={required}
      placeholder="Search and select client..."
      options={options}
      selectedValue={selectedValue}
      onSelect={onSelect}
      error={error}
      searchable
      leftIcon="person-outline"
      className={className}
      title="Select Client"
    />
  );
}
