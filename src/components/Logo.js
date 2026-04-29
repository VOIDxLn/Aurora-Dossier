import { Image } from 'react-native';

export default function Logo(props) {

    return <Image source={require('../../assets/Logo.png')} 
    style={{width: props.width, height: props.height}} />
}