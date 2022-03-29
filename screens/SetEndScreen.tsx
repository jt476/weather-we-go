import LocationInput from '../components/LocationInput';
import { Location } from '../enum/Location';

export default function SetEndScreen({ route, navigation } : {route: any, navigation: any}) {
  return (
    <LocationInput route={route} location={Location.Finishing} navigation={navigation}/>
  );
}
