import styled from 'styled-components';

const Label = styled.label`
  font-size: 10pt;
  color: ${({ theme }) => theme.colors.main};
  transition: all 220ms ease-in-out;
`;

const TextInput = styled.input`
  position: relative;
  border: none;
  outline: none;
  padding: 10px 5px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.main};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all 100ms ease-in-out;

  &::after {
    content: '';
    height: 4px;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.main};
  }
`;

const LabelledInput = styled.div`
  position: relative;
  ${Label} {
    position: absolute;
    left: 0;
    transform: translateY(10px);
    pointer-events: none;
  }

  ${TextInput} {
    padding: 10px 0;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.main};
  }

  ${TextInput}:focus,
  ${TextInput}:valid {
    border-bottom: 3px solid ${({ theme }) => theme.colors.main};
    & + ${Label} {
      font-size: 8pt;
      transform: translateY(-10px);
    }
  }
`;

interface ButtonProps {
  variant: 'primary' | 'secondary';
}
const Button = styled.button<ButtonProps>`
  border: none;
  padding: 10px 5px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: transform 220ms ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
`;

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.main};
`;

export { Label, TextInput, LabelledInput, PrimaryButton, SecondaryButton };
