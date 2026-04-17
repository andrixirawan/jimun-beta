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
import type { SignUpInput } from '../../lib/auth/auth.schemas';
import { signUpInputSchema } from '../../lib/auth/auth.schemas';
import { useAuthStore } from '../../lib/auth/auth.store';
import { getFirstFieldErrors } from '../../lib/validation/zod';

type SignUpField = keyof SignUpInput;

export default function RegisterScreen() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);
  const themeColorAccentForeground = useThemeColor('accent-foreground');

  const [formValues, setFormValues] = useState<SignUpInput>({
    email: '',
    name: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<SignUpField, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: SignUpField, value: string) => {
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
    const parsedValues = signUpInputSchema.safeParse(formValues);

    if (!parsedValues.success) {
      setFieldErrors(getFirstFieldErrors<SignUpField>(parsedValues.error));
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await signUp(parsedValues.data);
      startTransition(() => {
        router.replace('/loading' as Href);
      });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to create your account.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      badge="New account"
      title="Create your account"
      description="Register with the backend contract in docs/auth, then we will open the protected area after a short loading step."
      footer={
        <View className="flex-row items-center gap-1">
          <AppText className="text-sm text-muted">Already registered?</AppText>
          <Link href="/sign-in" asChild>
            <Pressable hitSlop={8}>
              <AppText className="text-sm font-semibold text-foreground">
                Sign in instead
              </AppText>
            </Pressable>
          </Link>
        </View>
      }
    >
      <View className="gap-4">
        <TextField isInvalid={Boolean(fieldErrors.name)}>
          <Label>Full name</Label>
          <Input
            autoCapitalize="words"
            autoComplete="name"
            onChangeText={(value) => updateField('name', value)}
            placeholder="Jane Doe"
            returnKeyType="next"
            textContentType="name"
            value={formValues.name}
          />
          {!fieldErrors.name ? (
            <Description>This value is sent as the Better Auth display name.</Description>
          ) : null}
          {fieldErrors.name ? <FieldError>{fieldErrors.name}</FieldError> : null}
        </TextField>

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
          {fieldErrors.email ? <FieldError>{fieldErrors.email}</FieldError> : null}
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.password)}>
          <Label>Password</Label>
          <Input
            autoCapitalize="none"
            autoComplete="new-password"
            autoCorrect={false}
            onChangeText={(value) => updateField('password', value)}
            onSubmitEditing={handleSubmit}
            placeholder="Create a strong password"
            returnKeyType="done"
            secureTextEntry
            textContentType="newPassword"
            value={formValues.password}
          />
          {!fieldErrors.password ? (
            <Description>We store only the session token on-device, inside SecureStore.</Description>
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
        <Button.Label>
          {isSubmitting ? 'Creating account' : 'Create account'}
        </Button.Label>
      </Button>
    </AuthScreenShell>
  );
}
