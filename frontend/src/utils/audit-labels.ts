const AUDIT_ACTION_LABELS: Readonly<Record<string, string>> = {
  'document.upload': 'Téléversement d’un document',
  'audio.transcribe': 'Transcription d’un audio',
  'billing.invoice.download': 'Téléchargement d’une facture',
  'plan.update': 'Modification d’un plan'
};

export const getAuditActionLabel = (action: string): string => {
  const knownLabel = AUDIT_ACTION_LABELS[action];

  if (knownLabel) {
    return knownLabel;
  }

  return action
    .split('.')
    .filter(Boolean)
    .map((segment) => segment.replaceAll('_', ' '))
    .join(' · ')
    .replace(/^./, (firstCharacter) => firstCharacter.toUpperCase());
};
