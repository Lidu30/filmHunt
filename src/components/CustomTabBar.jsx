import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

export function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets()

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={[styles.container, { bottom: insets.bottom + 10 }]}
    >
      {state.routes.map((route, idx) => {
        const { options } = descriptors[route.key]
        const label = options.title ?? route.name
        const isFocused = state.index === idx

        const onPress = () => {
          const evt = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !evt.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const icon = options.tabBarIcon
          ? options.tabBarIcon({
              focused: isFocused,
              color: '#fff',
              size: 24,
            })
          : null

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            {icon}
            <Text style={[styles.label, isFocused ? styles.active : styles.inactive]}>
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    //shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    //elevation for Android
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: 12,
  },
  active: {
    color: '#fff',
  },
  inactive: {
    color: '#ddd',
  },
})
