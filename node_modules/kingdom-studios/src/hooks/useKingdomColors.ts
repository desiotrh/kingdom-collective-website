import { KingdomColors } from '../constants/KingdomColors';
import { useDualMode } from '../contexts/DualModeContext';

export const useKingdomColors = () => {
  const { isDualMode, currentMode } = useDualMode();
  
  if (isDualMode) {
    return currentMode === 'faith' ? KingdomColors.faith : KingdomColors.encouragement;
  }
  
  return KingdomColors.default;
};

export default useKingdomColors;
