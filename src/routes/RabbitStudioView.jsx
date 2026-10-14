import React from 'react';
import RabbitStudio from '../features/rabbit-studio/RabbitStudio';

/**
 * RABBIT STUDIO VIEW (/tool/rabbit_studio)
 * 
 * Renders Rabbit Studio as a full native React component.
 */
const RabbitStudioView = ({ onBackToPortfolio }) => {
  return <RabbitStudio onBackToPortfolio={onBackToPortfolio} />;
};

export default RabbitStudioView;
