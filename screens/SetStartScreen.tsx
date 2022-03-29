import LocationInput from '../components/LocationInput';
import { Location } from '../enum/Location';

export default function SetStartScreen({ navigation } : {navigation: any}) {
  return (
    <LocationInput location={Location.Starting} askCurrentLoc={true} navigation={navigation}/>
  );
}
