export const getBaseUrl = () => {
    // IMPORTANTE: Mudar para o IP da sua máquina para o mobile conectar!
    // Você pode ver seu IP rodando 'ipconfig' no terminal
    const ip = '10.130.42.91';
    return `http://${ip}:3000`;
};

