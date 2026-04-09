"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";

export function EmployeeTableRow({
  employeeId,
  nameForA11y,
  children,
}: {
  employeeId: string;
  nameForA11y: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const href = `/employees/${employeeId}`;

  function go() {
    router.push(href);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTableRowElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  }

  return (
    <tr
      role="link"
      tabIndex={0}
      aria-label={`Fiche de ${nameForA11y}`}
      className="group cursor-pointer hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      onClick={go}
      onKeyDown={onKeyDown}
    >
      {children}
    </tr>
  );
}
