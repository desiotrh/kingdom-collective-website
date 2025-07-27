import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';
import { Colors } from '@/constants/Colors';

const StyledButton = styled.TouchableOpacity<{ variant?: 'primary' | 'gold' }>`
  background-color: ${({ variant }) =>
        variant === 'gold' ? Colors.dark.gold : Colors.dark.crimson};
  padding-vertical: 16px;
  padding-horizontal: 32px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  shadow-color: ${Colors.dark.crimson};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  elevation: 3;
  transition: background-color 0.2s;
`;

const ButtonText = styled.Text`
  color: ${Colors.dark.black};
  font-family: 'Anton';
  font-size: 20px;
  letter-spacing: 1px;
`;

type ButtonProps = TouchableOpacityProps & {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'gold';
};

export const Button: React.FC<ButtonProps> = ({ title, loading, variant, ...props }) => (
    <StyledButton activeOpacity={0.85} variant={variant} {...props}>
        {loading ? <ActivityIndicator color={Colors.dark.black} /> : <ButtonText>{title}</ButtonText>}
    </StyledButton>
);

export default Button; 