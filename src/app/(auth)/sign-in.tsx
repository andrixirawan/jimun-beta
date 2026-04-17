import { type Href, Link, useRouter } from 'expo-router';
import {
  Button,
  Description,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
  useThemeColor,
} from 'heroui-native';
import { startTransition, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AuthScreenShell } from '../../components/auth/auth-screen-shell';
import { AppText } from '../../components/app-text';
import type { SignInInput } from '../../lib/auth/auth.schemas';
import { signInInputSchema } from '../../lib/auth/auth.schemas';
import { useAuthStore } from '../../lib/auth/auth.store';
import { getFirstFieldErrors } from '../../lib/validation/zod';

type SignInField = keyof SignInInput;

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const themeColorAccentForeground = useThemeColor('accent-foreground');

  const [formValues, setFormValues] = useState<SignInInput>({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<SignInField, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: SignInField, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setFormError(null);
  };

  const handleSubmit = async () => {
    const parsedValues = signInInputSchema.safeParse(formValues);

    if (!parsedValues.success) {
      setFieldErrors(getFirstFieldErrors<SignInField>(parsedValues.error));
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await signIn(parsedValues.data);
      startTransition(() => {
        router.replace('/loading' as Href);
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to sign in.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      badge="Auth flow"
      title="Welcome back"
      description="Sign in with your email and password to restore your secure session."
      footer={
        <View className="flex-row items-center gap-1">
          <AppText className="text-sm text-muted">New here?</AppText>
          <Link href="/register" asChild>
            <Pressable hitSlop={8}>
              <AppText className="text-sm font-semibold text-foreground">
                Create an account
              </AppText>
            </Pressable>
          </Link>
        </View>
      }
    >
      <View className="gap-4">
        <TextField isInvalid={Boolean(fieldErrors.email)}>
          <Label>Email</Label>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(value) => updateField('email', value)}
            placeholder="jane@example.com"
            returnKeyType="next"
            textContentType="emailAddress"
            value={formValues.email}
          />
          {!fieldErrors.email ? (
            <Description>Use the same email that exists on your backend.</Description>
          ) : null}
          {fieldErrors.email ? <FieldError>{fieldErrors.email}</FieldError> : null}
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.password)}>
          <Label>Password</Label>
          <Input
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            onChangeText={(value) => updateField('password', value)}
            onSubmitEditing={handleSubmit}
            placeholder="Enter your password"
            returnKeyType="go"
            secureTextEntry
            textContentType="password"
            value={formValues.password}
          />
          {!fieldErrors.password ? (
            <Description>Passwords must contain at least 8 characters.</Description>
          ) : null}
          {fieldErrors.password ? (
            <FieldError>{fieldErrors.password}</FieldError>
          ) : null}
        </TextField>
      </View>

      {formError ? (
        <View className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3">
          <AppText className="text-sm font-medium text-danger">{formError}</AppText>
        </View>
      ) : null}

      <Button onPress={handleSubmit} isDisabled={isSubmitting}>
        {isSubmitting ? (
          <Spinner color={themeColorAccentForeground} size="sm" />
        ) : null}
        <Button.Label>{isSubmitting ? 'Signing in' : 'Sign In'}</Button.Label>
      </Button>
    </AuthScreenShell>
  );
}
