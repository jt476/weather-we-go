import LocationInput from '../components/LocationInput';
import { Location } from '../enum/Location';

export default function SetEndScreen({ askCurrentLoc, navigation } : {askCurrentLoc : boolean, navigation: any}) {
  return (
    <LocationInput location={Location.Finishing} askCurrentLoc={!askCurrentLoc} navigation={navigation}/>
  );
}
