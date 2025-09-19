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
import { VStack } from '@/components/ui/vstack';
import { JSX, useState } from "react";

const log = LOG.extend('AxiosBase');

const SignIn = (): JSX.Element => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { idServer } = useServicesClient();

    const handleLogin = async () => {
        log.debug('Attempting login with email:', email);
        log.debug('Attempting login with password:', password);
        const resp = await idServer.login(email, password);
        log.debug('Login response:', resp);
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