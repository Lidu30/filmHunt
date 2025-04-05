import { observer } from "mobx-react-lite"
import { ScrollView, View, Text } from "react-native";

export const homepage = observer(() => {
    return (
        <ScrollView>
            <View>
                <Text>Welcome to homepage</Text>
            </View>
        </ScrollView>
    );
});