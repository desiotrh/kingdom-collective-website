import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

// Performance-optimized component factory
export const createOptimizedComponent = <P extends {}>(
  Component: React.ComponentType<P>,
  options: {
    memoize?: boolean;
    displayName?: string;
    shouldUpdate?: (prevProps: P, nextProps: P) => boolean;
  } = {}
) => {
  const { memoize = true, displayName, shouldUpdate } = options;

  let OptimizedComponent = Component;

  if (memoize) {
    OptimizedComponent = memo(Component, shouldUpdate);
  }

  if (displayName) {
    OptimizedComponent.displayName = displayName;
  }

  return OptimizedComponent;
};

// Optimized list item component
export const OptimizedListItem = memo<{
  id: string | number;
  title: string;
  subtitle?: string;
  onPress?: (id: string | number) => void;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
}>(({ id, title, subtitle, onPress, rightElement, leftElement }) => {
  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [id, onPress]);

  return (
    <Pressable style={styles.listItem} onPress={handlePress}>
      {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    </Pressable>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.onPress === nextProps.onPress
  );
});

// Optimized text component with built-in performance features
export const OptimizedText = memo<{
  children: React.ReactNode;
  style?: any;
  numberOfLines?: number;
  allowFontScaling?: boolean;
}>(({ children, style, numberOfLines, allowFontScaling = false }) => {
  return (
    <Text
      style={style}
      numberOfLines={numberOfLines}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={1.2}
    >
      {children}
    </Text>
  );
});

// Optimized button component
export const OptimizedButton = memo<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}>(({ title, onPress, disabled, variant = 'primary', size = 'medium' }) => {
  const buttonStyle = useMemo(() => {
    const baseStyles = [styles.button];
    
    if (variant === 'primary') baseStyles.push(styles.buttonPrimary);
    if (variant === 'secondary') baseStyles.push(styles.buttonSecondary);
    if (variant === 'danger') baseStyles.push(styles.buttonDanger);
    
    if (size === 'small') baseStyles.push(styles.buttonSmall);
    if (size === 'medium') baseStyles.push(styles.buttonMedium);
    if (size === 'large') baseStyles.push(styles.buttonLarge);
    
    if (disabled) baseStyles.push(styles.buttonDisabled);
    
    return baseStyles;
  }, [variant, size, disabled]);

  const textStyle = useMemo(() => {
    const baseStyles = [styles.buttonText];
    
    if (variant === 'primary') baseStyles.push(styles.buttonTextPrimary);
    if (variant === 'secondary') baseStyles.push(styles.buttonTextSecondary);
    if (variant === 'danger') baseStyles.push(styles.buttonTextDanger);
    
    return baseStyles;
  }, [variant]);

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: '#ffffff30' }}
    >
      <OptimizedText style={textStyle}>{title}</OptimizedText>
    </Pressable>
  );
});

// Optimized image placeholder with lazy loading
export const OptimizedImagePlaceholder = memo<{
  width: number;
  height: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}>(({ width, height, backgroundColor = '#f0f0f0', children }) => {
  const containerStyle = useMemo(() => ({
    width,
    height,
    backgroundColor,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 8,
  }), [width, height, backgroundColor]);

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
});

// Optimized card component
export const OptimizedCard = memo<{
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  elevation?: number;
}>(({ children, style, onPress, elevation = 2 }) => {
  const cardStyle = useMemo(() => [
    styles.card,
    { elevation },
    style,
  ], [elevation, style]);

  if (onPress) {
    return (
      <Pressable style={cardStyle} onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
});

// Debounced input component
export const OptimizedInput = memo<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
  style?: any;
}>(({ value, onChangeText, placeholder, debounceMs = 300, style }) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChangeText callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChangeText(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChangeText, value]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChangeText = useCallback((text: string) => {
    setLocalValue(text);
  }, []);

  return (
    <TextInput
      style={[styles.input, style]}
      value={localValue}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
    />
  );
});

// Performance monitoring HOC
export const withPerformanceMonitoring = <P extends {}>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return memo<P>((props) => {
    const renderStart = useMemo(() => Date.now(), []);

    useEffect(() => {
      const renderTime = Date.now() - renderStart;
      if (renderTime > 16) { // More than one frame (16.67ms)
        console.warn(`⚠️ Slow render: ${componentName} took ${renderTime}ms`);
      }
    });

    return <Component {...props} />;
  });
};

// Virtualized list helper for large datasets
export const createVirtualizedList = <T extends {}>(
  renderItem: (item: T, index: number) => React.ReactElement,
  options: {
    itemHeight?: number;
    overscan?: number;
  } = {}
) => {
  const { itemHeight = 50, overscan = 5 } = options;

  return memo<{
    data: T[];
    containerHeight: number;
  }>(({ data, containerHeight }) => {
    const [scrollOffset, setScrollOffset] = useState(0);

    const visibleItems = useMemo(() => {
      const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - overscan);
      const endIndex = Math.min(
        data.length - 1,
        Math.ceil((scrollOffset + containerHeight) / itemHeight) + overscan
      );

      return data.slice(startIndex, endIndex + 1).map((item, index) => ({
        item,
        index: startIndex + index,
      }));
    }, [data, scrollOffset, containerHeight, itemHeight, overscan]);

    return (
      <View style={{ height: containerHeight }}>
        {visibleItems.map(({ item, index }) => (
          <View key={index} style={{ height: itemHeight }}>
            {renderItem(item, index)}
          </View>
        ))}
      </View>
    );
  });
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e1e5e9',
  },
  leftElement: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  rightElement: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#6366f1',
  },
  buttonSecondary: {
    backgroundColor: '#e5e7eb',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
  },
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonMedium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonLarge: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextSecondary: {
    color: '#374151',
  },
  buttonTextDanger: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
});

// Export all optimized components
export default {
  OptimizedListItem,
  OptimizedText,
  OptimizedButton,
  OptimizedImagePlaceholder,
  OptimizedCard,
  OptimizedInput,
  createOptimizedComponent,
  withPerformanceMonitoring,
  createVirtualizedList,
};
