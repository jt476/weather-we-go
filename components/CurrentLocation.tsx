import { Button, View, Alert, Text } from "react-native";

export function CurrentLocation() {
    return <View>
        <Button
            title="Press me"
            onPress={() => Alert.alert('Simple Button pressed')}
        />
        <Text>Or</Text>
    </View>;
  }
  