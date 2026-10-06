import VehicleDetail from "../components/VehicleDetail";
import { getCar } from "../services/vehicleApi";
export default function CarDetail() { return <VehicleDetail getter={getCar} back="/cars" label="Car" />; }
