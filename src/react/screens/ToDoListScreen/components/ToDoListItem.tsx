import { Checkbox } from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ToDoItemViewModel } from '../../todoViewModel';
import { ToDoListScreenPresenterContext as ToDoContext } from '../ToDoListScreenPresenter';

type Props = {
  item: ToDoItemViewModel;
};

export const ToDoListItem = observer(function ToDoListItem({ item }: Props) {
  const presenter = ToDoContext.useContext();
  const router = useRouter();

  const onChange = action((value: boolean) =>
    presenter.onDoneChange(item.id, value),
  );

  const onClick = action(() =>
    router.push({ pathname: `/todo`, params: { id: item.id } }),
  );

  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.item}>
        <Checkbox
          style={styles.checkbox}
          value={item.isDone}
          onValueChange={onChange}
        />
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
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
