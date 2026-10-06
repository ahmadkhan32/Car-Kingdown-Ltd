import VehicleDetail from "../components/VehicleDetail";
import { getBike } from "../services/vehicleApi";
export default function BikeDetail() { return <VehicleDetail getter={getBike} back="/bikes" label="Bike" />; }
