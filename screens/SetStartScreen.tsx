import LocationInput from '../components/LocationInput';
import { Location } from '../enum/Location';

export default function SetStartScreen({ route, navigation } : {route: any, navigation: any}) {
  return (
    <LocationInput route={route} location={Location.Starting} navigation={navigation}/>
  );
}
