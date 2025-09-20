import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AuthScreen from "../screens/auth/auth";
import HomeScreen from "../screens/home/home";
import ProfileScreen from "../screens/profile/profile";
import SettingsScreen from "../screens/settings/settings";
import useStore from "../stores/persistedStore";

const Stack = createNativeStackNavigator();

// const HomeScreen = lazy(() => import('./HomeScreen'));
// const ProfileScreen = lazy(() => import('./ProfileScreen'));

// 登录后可访问的 screens
const signedInScreens = [
  { name: "Home", component: HomeScreen },
  { name: "Profile", component: ProfileScreen },
  { name: "Settings", component: SettingsScreen },
  // ...更多screen
];

// 未登录可访问的 screens
const signedOutScreens = [
  { name: "Auth", component: AuthScreen },
  // ...更多screen
];

const Navigation = () => {
  const insets = useSafeAreaInsets();
  const { authCredentials } = useStore((state) => state);

  const isSignedIn = React.useMemo(() => {
    return authCredentials?.token ? true : false;
  }, [authCredentials]);

  const screens = isSignedIn ? signedInScreens : signedOutScreens;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isSignedIn ? "Home" : "Auth"}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        }}
      >
        {screens.map((screen) => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{ headerShown: false }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
