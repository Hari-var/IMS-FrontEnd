import React from 'react';

/**
 * CardActions Component
 * 
 * Provides a footer area for card actions (buttons, links, etc.)
 * Typically used for action buttons at the bottom of a card.
 * 
 * Props:
 * - children: React.ReactNode - Card action content
 * - className: string - Additional CSS classes for customization
 */
export interface CardActionsProps {
  children?: React.ReactNode;
  className?: string;
}

const CardActions: React.FC<CardActionsProps> = ({ children, className = '' }) => {
  return <div className={`flex items-center gap-[var(--gap-small)] ${className}`}>{children}</div>;
};

export default CardActions;
