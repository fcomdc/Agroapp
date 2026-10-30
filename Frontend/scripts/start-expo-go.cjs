// Expo puede mostrar el selector aun con --go si expo-dev-client está instalado.
// Se configura antes de cargar el CLI y funciona también en PowerShell.
const extraArgs = process.argv.slice(2);
const expoCli = require.resolve('expo/bin/cli');

process.env.EXPO_NO_REDIRECT_PAGE = '1';
process.argv = [process.execPath, expoCli, 'start', '--go', ...extraArgs];

require(expoCli);
