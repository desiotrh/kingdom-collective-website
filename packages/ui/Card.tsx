import React from 'react';
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { LaunchpadTheme } from '../../packages/theme/launchpadTheme';

const StyledCard = styled.View`
  background-color: ${LaunchpadTheme.colors.cloudWhite};
  border-radius: ${LaunchpadTheme.radius.lg}px;
  padding: ${LaunchpadTheme.spacing.lg}px;
  margin-vertical: ${LaunchpadTheme.spacing.md}px;
  box-shadow: 0px 2px 8px rgba(44, 62, 80, 0.08);
`;

export const Card: React.FC<ViewProps> = ({ children, ...props }) => (
    <StyledCard {...props}>{children}</StyledCard>
);

export default Card; 