import { Checkbox } from 'expo-checkbox';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, View } from 'react-native';

import { ToDoItemViewModel } from '../../todoViewModel';
import { useToDoListScreenPresenterContext } from '../ToDoListScreenPresenter';

type Props = {
  item: ToDoItemViewModel;
};

export const ToDoListItem = observer(function ToDoListItem({ item }: Props) {
  const presenter = useToDoListScreenPresenterContext();
  const onChange = action((value: boolean) =>
    presenter.onDoneChange(item.id, value),
  );

  return (
    <View style={styles.item}>
      <Checkbox
        style={styles.checkbox}
        value={item.isDone}
        onValueChange={onChange}
      />
      <Text>{item.title}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  item: {
    padding: 10,
    margin: 4,
    fontSize: 18,
    height: 44,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: { marginRight: 14 },
});
