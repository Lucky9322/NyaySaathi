import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  compact?: boolean;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-4 rounded-lg"
        style={{ background: '#f8f9fb', border: '1px solid #e8eaed' }}
      >
        <div
          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}
        >
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="text-xs font-medium text-blue-700 hover:text-blue-900 whitespace-nowrap transition-colors"
          >
            {action.label} →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}
      >
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-5">{description}</p>
      )}
      {action && (
        <Link href={action.href} className="btn-primary text-sm">
          {action.label}
        </Link>
      )}
    </div>
  );
}
