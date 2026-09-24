"use client";

import { AlertTriangle, FileText, Mail, ShieldCheck, Users } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import "@/lib/i18n";
import Link from "next/link";

export default function PrivacyPage() {
  const { t } = useTranslation();
  const { formatSpecificDate } = useDateFormatter();

  // Format the last updated date (14 de mayo de 2025)
  const lastUpdated = formatSpecificDate(14, 5, 2025);

  return (
    <div className="bg-secondary">

    <div className="container mx-auto px-4 py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-primary mb-2">{t('privacy.title')}</h1>
          <p className="text-sm text-text">
            {t('privacy.last_updated').replace('{{date}}', lastUpdated)}
          </p>
        </header>

        <section className="space-y-4">
          <p className="leading-relaxed text-lg">
            {t('privacy.introduction.content')}
          </p>
        </section>

        <Section
          icon={<FileText className="text-accent w-6 h-6" />}
          title={t('privacy.data_collection.title')}
          description={t('privacy.data_collection.content')}
          items={[
            {
              title: t('privacy.data_collection.types.personal'),
              description: t('privacy.data_collection_descriptions.personal_desc'),
            },
            {
              title: t('privacy.data_collection.types.documents'),
              description: t('privacy.data_collection_descriptions.documents_desc'),
            },
            {
              title: t('privacy.data_collection.types.usage'),
              description: t('privacy.data_collection_descriptions.usage_desc'),
            },
            {
              title: t('privacy.data_collection.types.technical'),
              description: t('privacy.data_collection_descriptions.technical_desc'),
            },
          ]}
        />

        <Section
          icon={<ShieldCheck className="text-accent w-6 h-6" />}
          title={t('privacy.data_usage.title')}
          items={[
            { title: t('privacy.data_usage.purpose1'), description: "" },
            { title: t('privacy.data_usage.purpose2'), description: "" },
            { title: t('privacy.data_usage.purpose3'), description: "" },
            { title: t('privacy.data_usage.purpose4'), description: "" },
            { title: t('privacy.data_usage.purpose5'), description: "" },
            { title: t('privacy.data_usage.purpose6'), description: "" },
          ]}
        />

        <Section
          icon={<ShieldCheck className="text-accent w-6 h-6" />}
          title={t('privacy.data_protection.title')}
          paragraph={t('privacy.data_protection.content')}
        />

        <Section
          icon={<Users className="text-accent w-6 h-6" />}
          title={t('privacy.user_rights.title')}
          items={[
            { title: t('privacy.user_rights.right1'), description: "" },
            { title: t('privacy.user_rights.right2'), description: "" },
            { title: t('privacy.user_rights.right3'), description: "" },
            { title: t('privacy.user_rights.right4'), description: "" },
            { title: t('privacy.user_rights.right5'), description: "" },
          ]}
        />

        <Section
          icon={<Mail className="text-accent w-6 h-6" />}
          title={t('privacy.contact_info.title')}
          paragraph={
            <>
              {t('privacy.contact_info.content')}{" "}
              <Link href="/contact" className="text-accent hover:underline font-medium">
                {t('privacy.contact_info.here')}
              </Link>
              .
            </>
          }
        />

        <div className="mt-8 text-center">
          <Link href="/" className="text-accent font-semibold hover:underline">
            ← {t('privacy.navigation.back_to_home')}
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}

interface SectionProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  items?: { title: string; description: string }[];
  paragraph?: React.ReactNode;
}

function Section({ icon, title, description, items, paragraph }: SectionProps) {
  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        {icon && <div>{icon}</div>}
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>
      {description && <p className="leading-relaxed">{description}</p>}
      {paragraph && <p className="leading-relaxed">{paragraph}</p>}
      {items && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {items.map((item, i) => (
            <li key={i} className="bg-primary shadow-md p-4 rounded-lg border border-xl border-none rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-primary">{item.title}</h3>
              {item.description && <p className="text-sm mt-1">{item.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
