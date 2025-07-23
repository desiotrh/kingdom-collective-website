import React from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { LaunchpadTheme } from '../../packages/theme/launchpadTheme';

const StyledInput = styled.TextInput`
  background-color: ${LaunchpadTheme.colors.cloudWhite};
  border: 1px solid ${LaunchpadTheme.colors.silverGray};
  border-radius: ${LaunchpadTheme.radius.md}px;
  padding: ${LaunchpadTheme.spacing.md}px;
  font-family: ${LaunchpadTheme.fonts.body};
  font-size: 16px;
  color: ${LaunchpadTheme.colors.sapphireBlue};
`;

export const TextInput: React.FC<TextInputProps> = (props) => <StyledInput {...props} />;

export default TextInput; 