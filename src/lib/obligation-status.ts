/**
 * Logique unique « date d'échéance + fenêtre d'alerte » (registre métier).
 * Aligné avec obligation_templates.alert_days : on considère la fenêtre jusqu'au max des seuils.
 */

const DEFAULT_ALERT_DAYS = [90, 30, 7];

/** Nombre de jours calendaires entre deux dates ISO (YYYY-MM-DD), from → to. */
export function calendarDaysFromTo(fromIsoDate: string, toIsoDate: string): number {
  const a = Date.UTC(
    Number(fromIsoDate.slice(0, 4)),
    Number(fromIsoDate.slice(5, 7)) - 1,
    Number(fromIsoDate.slice(8, 10))
  );
  const b = Date.UTC(
    Number(toIsoDate.slice(0, 4)),
    Number(toIsoDate.slice(5, 7)) - 1,
    Number(toIsoDate.slice(8, 10))
  );
  return Math.round((b - a) / 86_400_000);
}

export function maxAlertLeadDays(alertDays: number[] | null | undefined): number {
  if (!alertDays?.length) return Math.max(...DEFAULT_ALERT_DAYS);
  return Math.max(...alertDays);
}

export type TimedObligationStatus = "expired" | "expiring_soon" | "valid";

/**
 * Statut dérivé d'une échéance et du template (hors « missing », géré à part : pas de preuve).
 */
export function statusFromDueDateAndAlerts(
  dueIsoDate: string,
  alertDays: number[] | null | undefined,
  todayIsoDate: string
): TimedObligationStatus {
  const lead = maxAlertLeadDays(alertDays);
  const daysUntil = calendarDaysFromTo(todayIsoDate, dueIsoDate);
  if (daysUntil < 0) return "expired";
  if (daysUntil <= lead) return "expiring_soon";
  return "valid";
}
