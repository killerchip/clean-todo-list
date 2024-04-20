import 'reflect-metadata';
import { Slot } from 'expo-router';
import '../mobx';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';

import { ToDoGateway } from '../gateways/ToDoGateway';
import { getContainer } from '../ioc/container';
import { useInitStore } from '../stores/AppInitStore';

const HomeLayout = observer(function HomeLayout() {
  const initStore = useInitStore();

  if (!initStore.isReady) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return <Slot />;
});

export default HomeLayout;

setTimeout(() => {
  getContainer().get<ToDoGateway>(ToDoGateway).getAll();
}, 1000);
