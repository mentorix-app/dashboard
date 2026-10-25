import { Label } from '@/src/shared/ui';

type SettingLabelProps = {
  htmlFor: string;
  label: string;
  required: boolean;
  id?: string;
};

/** Setting label with a visual required marker (the input itself carries `aria-required`). */
export const SettingLabel = ({ htmlFor, label, required, id }: SettingLabelProps) => (
  <Label id={id} htmlFor={htmlFor} className="gap-1">
    {label}
    {required ? (
      <span aria-hidden="true" className="text-destructive">
        *
      </span>
    ) : null}
  </Label>
);
