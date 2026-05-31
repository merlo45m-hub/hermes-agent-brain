import { Tabs } from "expo-router";
import { Image, Library, Share2 } from "lucide-react-native";
import { StyleSheet } from "react-native";

const ICON_SIZE = 22;
const COLORS = {
  active: "#4A9EFF",
  inactive: "#666",
  bg: "#0a0a0a",
  tabBar: "#121212",
  border: "#1a1a1a",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <Library size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          title: "Edit",
          tabBarIcon: ({ color }) => <Image size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          title: "Export",
          tabBarIcon: ({ color }) => <Share2 size={ICON_SIZE} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.tabBar,
    borderTopColor: COLORS.border,
    borderTopWidth: 0.5,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
