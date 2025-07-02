import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export type NavigationProps = NavigationProp<RootStackParamList>;

export const useAppNavigation = () => {
  return useNavigation<NavigationProps>();
};
