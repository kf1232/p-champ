export type GearEmptyStateProps = {
  message: string;
};

export function GearEmptyState({ message }: GearEmptyStateProps) {
  return <p className="character-overview-empty">{message}</p>;
}
