import { ActivityIndicator, Button, Text, View } from "react-native";
import * as Clarity from "@microsoft/react-native-clarity";
import { useState } from "react";
import * as Updates from "expo-updates";
export default function Index() {
  Clarity.initialize("t0eiarz3dw", {
    logLevel: Clarity.LogLevel.Verbose, // Note: Use "LogLevel.Verbose" value while testing to debug initialization issues.
  });
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{status}</Text>
      {loading && <ActivityIndicator style={{ margin: 10 }} />}
      <Button title="manual update" onPress={handleUpdate} disabled={loading} />
    </View>
  );
}
