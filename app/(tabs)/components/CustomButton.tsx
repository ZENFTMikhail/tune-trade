import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';

// Определяем типы для пропсов
interface CustomButtonProps {
  title: string; // Текст кнопки
  onPress: (event: GestureResponderEvent) => void; // Обработчик нажатия
  buttonStyle?: ViewStyle; // Дополнительные стили для кнопки
  textStyle?: TextStyle; // Дополнительные стили для текста
  disabled?: boolean; // Флаг отключения кнопки
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Базовые стили
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF', // Синий цвет фона
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Тень для Android
    shadowColor: '#000', // Тень для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    color: '#fff', // Белый цвет текста
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Серый цвет для отключенной кнопки
  },
  disabledText: {
    color: '#D3D3D3', // Светло-серый цвет текста для отключенной кнопки
  },
});

export default CustomButton;