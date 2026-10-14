import React from 'react';
import LinkTree from '../features/rabbit-tree/LinkTree';

/**
 * LINK TREE VIEW (/link)
 * 
 * Standalone route for the official Rabbit Tree link hub.
 */
export default function LinkTreeView({ onBackToPortfolio }) {
  return <LinkTree onBackToPortfolio={onBackToPortfolio} />;
}
