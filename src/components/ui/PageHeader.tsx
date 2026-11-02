import React from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Eyebrow + serif title + optional lead: the heading of every top-level section. */
export function PageHeader({ eyebrow, title, lead, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <h1 className="page-header__title">{title}</h1>
        {actions}
      </div>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}
