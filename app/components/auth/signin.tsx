import useServicesClient from '@/app/services/axios/clients';
import { LOG } from '@/app/utils/loger/logger';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { JSX, useState } from "react";

const log = LOG.extend('AxiosBase');

const SignIn = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { idServer } = useServicesClient();
    const toast = useToast();

    const handleLogin = async () => {
        try {
            const resp = await idServer.login(email, password);
            log.debug('Login response:', resp);

            // 登录成功的 toast
            toast.show({
                placement: "top",
                render: ({ id }) => {
                    return (
                        <Toast nativeID={id} action="success" variant="solid">
                            <ToastTitle>登录成功</ToastTitle>
                            <ToastDescription>
                                欢迎回来！
                            </ToastDescription>
                        </Toast>
                    );
                },
            });

        } catch (error) {
            log.error('Login error:', error);

            // 登录失败的 toast
            toast.show({
                placement: "top",
                render: ({ id }) => {
                    return (
                        <Toast nativeID={id} action="error" variant="solid">
                            <ToastTitle>登录失败</ToastTitle>
                            <ToastDescription>
                                请检查您的邮箱和密码
                            </ToastDescription>
                        </Toast>
                    );
                },
            });
        }
    };

    return (
        <Box className="flex-1 justify-center items-center p-6">
            <VStack className="space-y-4 w-full max-w-96">
                <Heading size="xl" className="text-center mb-6">
                    Sign In
                </Heading>

                <FormControl>
                    <FormControlLabel >
                        <FormControlLabelText>Email</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                        <InputField
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </Input>
                </FormControl>

                <FormControl>
                    <FormControlLabel >
                        <FormControlLabelText>Password</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                        <InputField
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </Input>
                </FormControl>

                <Button
                    size="lg"
                    onPress={handleLogin}
                    className="mt-4"
                >
                    <ButtonText>Login</ButtonText>
                </Button>
            </VStack>
        </Box>
    );
};

export default SignIn;