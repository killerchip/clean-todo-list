import { Checkbox } from 'expo-checkbox';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

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
    <>
      <Stack.Screen options={{ title: presenter.pageTitle }} />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.idContainer}>
            <Text style={styles.idLabel}>
              Id: {presenter.formData.id ?? '-'}
            </Text>
            <View style={styles.doneContainer}>
              <Text>Is Done</Text>
              <Checkbox
                value={presenter.formData.isDone}
                onValueChange={onChangeIsDone}
                style={styles.checkbox}
              />
            </View>
          </View>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.textInput}
            value={presenter.formData.title}
            onChangeText={onChangeTitle}
          />
          <Text style={styles.label}>Task Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={presenter.formData.description ?? ''}
            onChangeText={onChangeDescription}
            multiline
          />
        </View>
        <View style={styles.buttonsContainer}>
          <Button onPress={onCancel} title='Cancel' color='gray' />
          <Button onPress={onSubmit} title='Save' />
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {},
  idContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: { marginLeft: 6 },
  idLabel: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'gray',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textInput: {
    backgroundColor: 'white',
    marginTop: 5,
    padding: 5,
  },
  textArea: {
    minHeight: 100,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
});

// ToDo: Properly style the screen
// - margins
// - TextInput styles

// TODO: Form Validation
// - Title is required
