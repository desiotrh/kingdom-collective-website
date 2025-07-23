import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';
import { LaunchpadTheme } from '../../packages/theme/launchpadTheme';

const StyledButton = styled.TouchableOpacity<{ variant?: 'primary' | 'gold' }>`
  background-color: ${({ variant }) =>
        variant === 'gold' ? LaunchpadTheme.colors.gold : LaunchpadTheme.colors.sapphireBlue};
  padding-vertical: ${LaunchpadTheme.spacing.md}px;
  padding-horizontal: ${LaunchpadTheme.spacing.lg}px;
  border-radius: ${LaunchpadTheme.radius.md}px;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 8px rgba(44, 62, 80, 0.08);
`;

const ButtonText = styled.Text`
  color: ${LaunchpadTheme.colors.cloudWhite};
  font-family: ${LaunchpadTheme.fonts.header};
  font-size: 18px;
`;

type ButtonProps = TouchableOpacityProps & {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'gold';
};

export const Button: React.FC<ButtonProps> = ({ title, loading, variant, ...props }) => (
    <StyledButton activeOpacity={0.85} variant={variant} {...props}>
        {loading ? <ActivityIndicator color={LaunchpadTheme.colors.cloudWhite} /> : <ButtonText>{title}</ButtonText>}
    </StyledButton>
);

export default Button; 