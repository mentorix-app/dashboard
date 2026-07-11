export type ViewMode = 'grid' | 'list';

export type ViewModeSwitchProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  labels: {
    grid: string;
    list: string;
  };
};
