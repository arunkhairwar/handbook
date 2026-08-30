import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { cn } from '@/src/lib/utils';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

const typeClasses: Record<string, string> = {
  default: 'text-base leading-6 text-text',
  defaultSemiBold: 'text-base leading-6 font-semibold text-text',
  title: 'text-3xl font-bold leading-8 text-text',
  subtitle: 'text-xl font-bold text-text',
  link: 'text-base leading-7 text-sky-600',
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      className={cn(typeClasses[type], className)}
      style={[{ color }, style]}
      {...rest}
    />
  );
}
