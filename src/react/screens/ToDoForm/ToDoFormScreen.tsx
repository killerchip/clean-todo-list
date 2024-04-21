import { Checkbox } from 'expo-checkbox';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import { useToDoListScreenPresenter } from './ToDoFormScreenPresenter';

export const ToDoFormScreen = observer(function ToDoFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const presenter = useToDoListScreenPresenter(id);
  const router = useRouter();

  const onSubmit = async () => {
    const success = await presenter.onSubmit();
    if (success) {
      router.back();
    }
  };

  const onCancel = () => {
    router.back();
  };

  const onChangeTitle = (text: string) => {
    presenter.updateFormData({ title: text });
  };

  const onChangeDescription = (text: string) => {
    presenter.updateFormData({ description: text });
  };

  const onChangeIsDone = (value: boolean) => {
    presenter.updateFormData({ isDone: value });
  };

  return (
    <View>
      <Stack.Screen options={{ title: presenter.pageTitle }} />
      <Text>Id: {presenter.formData.id ?? '-'}</Text>
      <Text>Task Title</Text>
      <TextInput
        value={presenter.formData.title}
        onChangeText={onChangeTitle}
      />
      <Text>Task Description</Text>
      <TextInput
        value={presenter.formData.description ?? ''}
        onChangeText={onChangeDescription}
      />
      <Text>Is Done</Text>
      <Checkbox
        value={presenter.formData.isDone}
        onValueChange={onChangeIsDone}
      />
      <Button onPress={onSubmit} title='Save' />
      <Button onPress={onCancel} title='Cancel' />
    </View>
  );
});

// ToDo: Properly style the screen
// - margins
// - TextInput styles

// TODO: Form Validation
// - Title is required
