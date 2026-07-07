'use client';

import { useState } from 'react';
import { History } from 'lucide-react';
import { useLocale, useTranslations } from '@/i18n';
import { ProgramStatus, useProgram, useProgramVersions } from '@/src/entities/program';
import { formatDate } from '@/src/shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Typography,
} from '@/src/shared/ui';

type WizardVersionBadgeProps = {
  programId: string;
};

/**
 * Shows the latest published version next to the program name and opens the
 * full version history. Version data only loads while the program is published.
 */
export const WizardVersionBadge = ({ programId }: WizardVersionBadgeProps) => {
  const t = useTranslations('ProgramWizard');
  const locale = useLocale();
  const [isVersionsOpen, setVersionsOpen] = useState(false);

  const { data: program } = useProgram(programId);
  const isPublished = program?.status === ProgramStatus.Published;
  const versionsQuery = useProgramVersions(programId, isPublished);

  const versions = versionsQuery.data?.items ?? [];
  const latestVersionNumber = versions.reduce((max, version) => Math.max(max, version.versionNumber), 0);

  if (versions.length === 0) {
    return null;
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setVersionsOpen(true)}>
        <History aria-hidden />
        {t('actions.versionBadge', { version: latestVersionNumber })}
      </Button>

      <Dialog open={isVersionsOpen} onOpenChange={setVersionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('actions.versionsModal.title')}</DialogTitle>
            <DialogDescription>{t('actions.versionsModal.description')}</DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col divide-y">
            {[...versions]
              .sort((a, b) => b.versionNumber - a.versionNumber)
              .map((version) => (
                <li key={version.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex flex-col">
                    <Typography variant="label-sm">
                      {t('actions.versionsModal.versionLabel', { version: version.versionNumber })}
                    </Typography>
                    <Typography variant="p-sm" className="text-muted-foreground">
                      {formatDate(version.createdAt, locale, 'shortDate')}
                    </Typography>
                  </div>
                  <Typography variant="p-sm" className="text-muted-foreground">
                    {t('actions.versionsModal.userCount', { count: version.assignmentCount })}
                  </Typography>
                </li>
              ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};
