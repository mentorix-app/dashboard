'use client';

import { ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Typography } from '@/src/shared/ui';

type ProgramPreviewCardProps = {
  title: string;
  name: string;
  namePlaceholder: string;
  levelLabel: string;
  categoryLabel: string;
  previewImageUrl: string;
  imageAlt: string;
};

export const ProgramPreviewCard = ({
  title,
  name,
  namePlaceholder,
  levelLabel,
  categoryLabel,
  previewImageUrl,
  imageAlt,
}: ProgramPreviewCardProps) => (
  <Card className="sticky top-6 gap-0 overflow-hidden pt-0">
    <div className="bg-muted relative aspect-video w-full">
      {previewImageUrl ? (
        <div
          role="img"
          aria-label={imageAlt}
          className="size-full bg-cover bg-center"
          style={{ backgroundImage: `url("${previewImageUrl}")` }}
        />
      ) : (
        <div className="text-muted-foreground flex size-full items-center justify-center">
          <ImageIcon className="size-10" aria-hidden />
        </div>
      )}
    </div>
    <CardHeader className="pt-6">
      <Typography variant="caption" className="text-muted-foreground">
        {title}
      </Typography>
      <CardTitle className="text-xl">{name || namePlaceholder}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-1">
      <Typography variant="p-sm" className="text-muted-foreground">
        {levelLabel}
      </Typography>
      <Typography variant="p-sm" className="text-muted-foreground">
        {categoryLabel}
      </Typography>
    </CardContent>
  </Card>
);
