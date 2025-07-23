import React from 'react';
import styled from 'styled-components/native';
import { LaunchpadTheme } from '../../packages/theme/launchpadTheme';

const StyledHeader = styled.Text`
  color: ${LaunchpadTheme.colors.sapphireBlue};
  font-family: ${LaunchpadTheme.fonts.header};
  font-size: 28px;
  margin-bottom: ${LaunchpadTheme.spacing.md}px;
`;

export const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <StyledHeader>{children}</StyledHeader>
);

export default Header; 