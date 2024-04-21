import { Stack, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Text, View } from 'react-native';

import { useToDoListScreenPresenter } from './ToDoFormScreenPresenter';

export const ToDoFormScreen = observer(function ToDoFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const presenter = useToDoListScreenPresenter(id);

  return (
    <View>
      <Stack.Screen options={{ title: presenter.pageTitle }} />
      <Text>Todo</Text>
    </View>
  );
});
