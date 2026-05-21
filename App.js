import 'react-native-gesture-handler';
import Navigation from './src/navigation/Navigation';
import { UserProvider } from './src/context/UserContext';

export default function App() {
    return (
        <UserProvider>
            <Navigation />
        </UserProvider>
    );
}
