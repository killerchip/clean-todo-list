import 'reflect-metadata';
import { Slot } from 'expo-router';
import '../mobx';

// eslint-disable-next-line mobx/missing-observer
export default function HomeLayout() {
  return <Slot />;
}
