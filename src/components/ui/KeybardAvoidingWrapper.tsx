import React, { useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
  ViewStyle,
  StyleProp,
} from 'react-native';
import ScreenHeader, { HeaderProps } from './ScreenHeader';

export interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;

  /**
   * Props for the ScreenHeader component.
   * Pass `null` to hide the header (e.g. auth screens that have custom headers).
   */
  header?: HeaderProps | null;

  /**
   * NativeWind className for the outer KeyboardAvoidingView container.
   * @default "flex-1 bg-background"
   */
  containerClassName?: string;

  /**
   * NativeWind className applied to the ScrollView's contentContainer.
   * @default "p-6"
   */
  contentContainerClassName?: string;

  /**
   * Additional inline style for the ScrollView's contentContainer.
   * Useful for custom padding overrides.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Bottom padding added to the ScrollView content so the last
   * fields can scroll above the keyboard comfortably.
   * @default 40
   */
  bottomPadding?: number;

  /**
   * When true, the ScrollView scrolls back to top after the keyboard
   * closes. Use this for screens with vertically centered content
   * (e.g. login/register) so the layout re-centers after dismissal.
   * @default false
   */
  resetScrollOnKeyboardHide?: boolean;

  /**
   * Whether to show the vertical scroll indicator.
   * @default false
   */
  showsVerticalScrollIndicator?: boolean;
}

/**
 * A reusable wrapper that handles keyboard avoidance + scrollable form content
 * on both Android and iOS.
 *
 * - On **Android** (with `softwareKeyboardLayoutMode: "pan"` in app.json):
 *   Uses `KeyboardAvoidingView` with `behavior="padding"` and a StatusBar offset.
 * - On **iOS**: Uses `KeyboardAvoidingView` with `behavior="padding"`.
 *
 * Wraps children in a `ScrollView` with `keyboardShouldPersistTaps="handled"`
 * and `keyboardDismissMode="interactive"` for the best form UX.
 *
 * @example
 * // With ScreenHeader (form screens)
 * <KeyboardAvoidingWrapper header={{ label: "Enroll Child", onBack: () => navigation.goBack() }}>
 *   <EnrollmentForm ... />
 * </KeyboardAvoidingWrapper>
 *
 * @example
 * // Without header, centered content (auth screens)
 * <KeyboardAvoidingWrapper header={null} resetScrollOnKeyboardHide contentContainerClassName="flex-grow p-6 pt-10">
 *   <View className="my-auto">...</View>
 * </KeyboardAvoidingWrapper>
 */
export const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({
  children,
  header,
  containerClassName = 'flex-1',
  contentContainerClassName = 'p-6',
  contentContainerStyle,
  bottomPadding = 40,
  resetScrollOnKeyboardHide = false,
  showsVerticalScrollIndicator = false,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!resetScrollOnKeyboardHide) return;

    const event = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const subscription = Keyboard.addListener(event, () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => subscription.remove();
  }, [resetScrollOnKeyboardHide]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={
        Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0
      }
      className={containerClassName}
    >
      {header !== null && header !== undefined && (
        <ScreenHeader {...header} />
      )}
      <ScrollView
        ref={scrollViewRef}
        contentContainerClassName={contentContainerClassName}
        contentContainerStyle={[{ paddingBottom: bottomPadding }, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;