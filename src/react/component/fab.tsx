import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  onPress: () => void;
};

export function FAB({ onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Ionicons name='add-outline' size={24} color='white' />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
