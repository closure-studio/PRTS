import * as Updates from "expo-updates";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useClarity } from "./hooks/clarity/useClarity";
import Navigation from "./navigation/navigation";

export default function App() {
  useClarity();
  const [status, setStatus] = useState<string>("热更新大成功");
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    setLoading(true);
    setStatus("checking for updates...");
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setStatus("a new update is available");
        await Updates.fetchUpdateAsync();
        setStatus("download finished, reloading...");
        Updates.reloadAsync();
      } else {
        setStatus("no new version available.");
      }
    } catch (e: any) {
      setStatus(`update failed: ${e.message || e.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Text>{status}</Text>
    //   {loading && <ActivityIndicator style={{ margin: 10 }} />}
    //   <Button title="manual update" onPress={handleUpdate} disabled={loading} />
    // </View>
  );
}
