import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import styled from 'styled-components';
import { Label, LabelledInput, TextInput, PrimaryButton } from '../formElements';
import { useAuth } from '../../context/Auth';

interface FormData {
  name: string;
}

const Container = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.form`
  width: 400px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 50px;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.dropShadow(100)};
`;

const Button = styled(PrimaryButton)`
  margin-top: 25px;
`;

const Error = styled.p`
  font-size: 8pt;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 6px;
`;

const Login: React.FC = () => {
  const { login, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = handleSubmit((data) => login(data));

  return (
    <Container>
      <LoginForm onSubmit={onSubmit}>
        <LabelledInput>
          <TextInput required type="text" {...register('name', { required: 'Your name is required', maxLength: 15 })} />
          <Label htmlFor="name">Please, enter your name</Label>
        </LabelledInput>
        <ErrorMessage errors={errors} name="name" render={({ message }) => <Error>{message}</Error>} />
        {error && <Error>{error}</Error>}
        <Button type="submit" variant="primary">
          Enter
        </Button>
      </LoginForm>
    </Container>
  );
};

export default Login;
