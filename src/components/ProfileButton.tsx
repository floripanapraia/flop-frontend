import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";

interface Props {
    onClick?: () => void;
    onProfileClick?: () => void;
    size?: number; // tamanho do botão em pixels, ex: 64
}

const ProfileButton: React.FC<Props> = ({ onClick, onProfileClick, size }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) return onClick();

        if (user) {
            onProfileClick?.();
        } else {
            navigate("/auth");
        }
    };

    const dimensionClass = `rounded-full overflow-hidden border-4 border-white shadow-lg hover:border-[#182E4C] transition-all duration-200 hover:shadow-xl`;


    if (!user) {
        return (
            <button
                onClick={handleClick}
                className="bg-[#182E4C] hover:bg-[#1a365d] text-white px-6 py-3 rounded-3xl text-sm font-medium transition-colors"
            >
                ENTRAR
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            style={{ width: `${size}px`, height: `${size}px` }}
            className="rounded-full overflow-hidden border-4 border-white shadow-lg hover:border-[#182E4C] transition-all duration-200 hover:shadow-xl"
            title={`Perfil de ${user.nome}`}
        >
            {user.fotoPerfil ? (
                <img
                    src={`data:image/jpeg;base64,${user.fotoPerfil}`}
                    alt={user.nome}
                    style={{ width: "100%", height: "100%" }}
                    className="object-cover"
                />
            ) : (
                <div
                    className="bg-[#182E4C] flex items-center justify-center text-white text-lg font-medium"
                    style={{ width: "100%", height: "100%" }}
                >
                    {user.nome.charAt(0).toUpperCase()}
                </div>
            )}
        </button>
    );
};

export default ProfileButton;
