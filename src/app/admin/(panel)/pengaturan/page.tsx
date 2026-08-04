import { SettingsForm } from '@/components/admin/settings-form';
import { DEFAULT_SETTINGS, SETTING_GROUPS, type SettingDef } from '@/lib/defaults';
import { safeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ grup?: string }>;
}) {
  const { grup } = await searchParams;
  const activeGroup = SETTING_GROUPS.find((g) => g.id === grup)?.id ?? SETTING_GROUPS[0].id;

  const rows = await safeQuery<{ key: string; value: string | null }>(
    'SELECT key, value FROM settings',
  );
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value ?? '']));

  const fields: (SettingDef & { current: string })[] = DEFAULT_SETTINGS.filter(
    (setting) => setting.group === activeGroup,
  ).map((setting) => ({
    ...setting,
    current: stored[setting.key] ?? setting.value,
  }));

  return (
    <>
      <header className="mb-7">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
          Pengelolaan
        </p>
        <h1 className="mt-2 text-3xl">Pengaturan Situs</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-500">
          Semua teks, gambar, dan informasi kontak di website dapat diubah dari halaman ini —
          termasuk nomor WhatsApp untuk tombol chat dan pengaturan SEO.
        </p>
      </header>

      <SettingsForm groups={SETTING_GROUPS} activeGroup={activeGroup} fields={fields} />
    </>
  );
}
