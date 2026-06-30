export type DayTabProps = {
  id: string;
  label: string;
  selectLabel: string;
  deleteLabel: string;
  reorderLabel: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
};
