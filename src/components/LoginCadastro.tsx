import styled from "styled-components";

interface SignInProps {
  signinIn?: boolean;
}

export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  background-color: #f6f5f7;
  padding: 20px;
`;

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 95%;
  min-height: 480px;

  @media (max-width: 768px) {
    min-height: 520px; // Um pouco mais alto em telas menores
  }
`;
export const SignUpContainer = styled.div<SignInProps>`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  overflow-y: auto; /* Adiciona rolagem vertical quando necessário */
  ${(props) =>
    props.signinIn !== true
      ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `
      : null}

  @media (max-width: 768px) {
    width: 100%; /* Em telas menores, usa a largura total */
  }
`;

export const SignInContainer = styled.div<SignInProps>`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  overflow-y: auto; /* Adiciona rolagem vertical quando necessário */
  ${(props) =>
    props.signinIn !== true ? `transform: translateX(100%);` : null}

  @media (max-width: 768px) {
    width: 100%; /* Em telas menores, usa a largura total */
  }
`;
export const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  height: 100%;
  text-align: center;
  width: 100%;
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  font-size: 30px;
  margin: 15px 0 30px;
  padding: 0 20px;
  max-width: 80%;
  margin: 0;
`;

export const Subtitle = styled.h2`
  font-size: 20px;
  color: solid #182e4c;
  text-align: left;
  width: 100%;
  border-bottom: 2px solid #182e4c;
`;
export const FormLabel = styled.label`
  display: block;
  text-align: left;
  width: 100%;
  font-weight: 500;
  color: #333;
  font-size: 12px;
  color: solid #182e4c;
`;
export const Input = styled.input`
  background-color: #f1f1f1;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 12px 15px;
  width: 100%;
  box-sizing: border-box; /* Importante: inclui padding e border no cálculo da largura */
  transition: all 0.3s;
  font-size: 15px;

  &:focus {
    outline: none;

    box-shadow: 0 0 0 2px rgba(7, 89, 133, 0.15);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

export const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #182e4c;
  background-color: #182e4c;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;
  margin-top: 15px;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 46, 76, 0.5);
  }
  &:disabled {
    background-color: #cccccc;
    border-color: #bbbbbb;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
`;

export const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

export const OverlayContainer = styled.div<SignInProps>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${(props) =>
    props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div<SignInProps>`
  background: rgb(11, 44, 105);
  background: -webkit-linear-gradient(to right, #075985, #075985);
  background: linear-gradient(to right, #075985, rgb(90, 145, 218));
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${(props) => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 10px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)<SignInProps>`
  transform: translateX(-20%);
  ${(props) => (props.signinIn !== true ? `transform: translateX(0);` : null)}
`;

export const RightOverlayPanel = styled(OverlayPanel)<SignInProps>`
  right: 0;
  transform: translateX(0);
  ${(props) => (props.signinIn !== true ? `transform: translateX(20%);` : null)}
`;

export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  margin: 15px 0 30px;
  padding: 0 20px;
  max-width: 80%;
  letter-spacing: 0.5px;
`;
