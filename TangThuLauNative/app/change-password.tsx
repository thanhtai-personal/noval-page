import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from '@/hooks/useTranslation';
import { Api } from '@/utils/api';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const submit = async () => {
    try {
      await Api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      router.back();
    } catch (e) {
      console.warn('Change password error', e);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('changePassword.title') }} />
      <TextInput
        style={styles.input}
        placeholder={t('changePassword.current_password')}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder={t('changePassword.new_password')}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title={t('changePassword.submit')} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
});
