import React from 'react';
import { Text, TouchableOpacity, View, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  label: string;
  onPress: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ containerStyle, textStyle, label, onPress, children, disabled }) => {
  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}
        >
          <Text style={textStyle}>{label}</Text>
          {children}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;