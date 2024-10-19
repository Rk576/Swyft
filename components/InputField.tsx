import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text
            className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}
            style={{ fontSize: 18 }}
          >
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500 ${containerStyle}`}
            style={{ height: 60 }} // Adjusted height for larger phones
          >
            {icon && (
              <Image
                source={icon}
                className={`ml-4 ${iconStyle}`}
                style={{ width: 24, height: 24 }} // Adjusted icon size
              />
            )}
            <TextInput
              className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
              style={{
                paddingLeft: 10, // Adjust padding to balance icon
                fontSize: 16, // Adjust font size
                height: "100%", // Take full height of container
              }}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
