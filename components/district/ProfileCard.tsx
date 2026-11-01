import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SourceTag } from '@/components/ui/SourceTag';
import type { Dictionary } from '@/lib/dictionary';
import type { District } from '@/lib/domain/districts';
import { CROPS, HAZARDS } from '@/lib/domain/vocab';
import type { Locale } from '@/lib/i18n';

export function ProfileCard({ district, locale, t }: { district: District; locale: Locale; t: Dictionary }) {
  const profile = district.profile;

  return (
    <Card
      title={t.desk.profile}
      footer={
        profile && (
          <>
            <SourceTag locale={locale} labels={t.source} source="KrishiBangla" />
            <p className="mt-1 text-xs text-fg-muted">{t.desk.curatedNote}</p>
          </>
        )
      }
    >
      {!profile ? (
        <p className="text-fg-muted">{t.desk.noProfile}</p>
      ) : (
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="mb-2 text-fg-muted">{t.desk.crops}</dt>
            <dd className="flex flex-wrap gap-2">
              {profile.crops.map((id) => (
                <Badge key={id} tone="brand">
                  <span aria-hidden>{CROPS[id].icon}</span> {CROPS[id][locale]}
                </Badge>
              ))}
            </dd>
          </div>
          {profile.soil && (
            <div>
              <dt className="mb-1 text-fg-muted">{t.desk.soil}</dt>
              <dd className="text-fg">{profile.soil[locale]}</dd>
            </div>
          )}
          {profile.hazards.length > 0 && (
            <div>
              <dt className="mb-2 text-fg-muted">{t.desk.hazards}</dt>
              <dd className="flex flex-wrap gap-2">
                {profile.hazards.map((id) => (
                  <Badge key={id} tone="warning">
                    {HAZARDS[id][locale]}
                  </Badge>
                ))}
              </dd>
            </div>
          )}
          {profile.advisory && (
            <div>
              <dt className="mb-1 text-fg-muted">{t.desk.advisory}</dt>
              <dd className="text-fg">{profile.advisory[locale]}</dd>
            </div>
          )}
        </dl>
      )}
    </Card>
  );
}
