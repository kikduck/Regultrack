/** Astérisque visuel pour les champs obligatoires (conserver `required` sur le contrôle pour l’accessibilité). */
export function RequiredFieldMark() {
  return (
    <span className="ml-0.5 font-semibold text-orange-600" aria-hidden="true">
      *
    </span>
  );
}
