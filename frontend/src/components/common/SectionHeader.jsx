import React from 'react';

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`mb-5 ${centered ? 'text-center' : ''}`}>
      <h2 className="display-6 fw-bold text-primary mb-3">
        {title}
      </h2>
      <div className={`mx-auto mb-3 ${centered ? '' : 'ms-0'}`} style={{ width: '80px', height: '4px', background: 'var(--color-secondary)' }}></div>
      {subtitle && (
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
