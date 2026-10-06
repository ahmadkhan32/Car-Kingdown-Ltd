import ListPage from "../components/ListPage";
import VehicleDetail from "../components/VehicleDetail";
import { getNewCars, getNewCar } from "../services/vehicleApi";
export default function NewCars() { return <ListPage title="New Cars" fetcher={getNewCars} base="new-cars" />; }
export function NewCarDetail() { return <VehicleDetail getter={getNewCar} back="/new-cars" label="New Car" />; }
