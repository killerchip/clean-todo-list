import { injectable } from 'inversify';
import { Alert } from 'react-native';

@injectable()
export class AlertUIGateway {
  alert(title: string, message?: string) {
    Alert.alert(title, message);
  }
}
