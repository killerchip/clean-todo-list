import { Stack } from 'expo-router';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import {
  useToDoListScreenPresenter,
  ToDoListScreenPresenterContext,
} from './ToDoListScreenPresenter';
import { ToDoListItem } from './components/ToDoListItem';
import { ToDoItemViewModel } from '../todoViewModel';

export const ToDoListScreen = observer(function ToDoListScreen() {
  const presenter = useToDoListScreenPresenter();

  const renderItem: ListRenderItem<ToDoItemViewModel> = ({ item }) => {
    return <ToDoListItem item={item} />;
  };

  return (
    <ToDoListScreenPresenterContext.Context.Provider value={presenter}>
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'To Do List' }} />
        <FlatList<ToDoItemViewModel>
          data={presenter.toDoList.slice()}
          renderItem={renderItem}
          keyExtractor={action((item) => item.id)}
        />
      </View>
    </ToDoListScreenPresenterContext.Context.Provider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});