import { Checkbox } from 'expo-checkbox';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, View } from 'react-native';

import { ToDoItemViewModel } from '../../todoViewModel';

type Props = {
  item: ToDoItemViewModel;
};

export const ToDoListItem = observer(function ToDoListItem({ item }: Props) {
  return (
    <View style={styles.item}>
      <Checkbox style={styles.checkbox} value={item.isDone} />
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
