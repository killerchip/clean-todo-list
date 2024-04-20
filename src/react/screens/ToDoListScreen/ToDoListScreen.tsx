import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';

import { useToDoListScreenPresenter } from './ToDoListScreenPresenter';

export const ToDoListScreen = observer(function ToDoListScreen() {
  const presenter = useToDoListScreenPresenter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{JSON.stringify(presenter.toDoList)}</Text>
    </View>
  );
});
