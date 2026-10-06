import ListPage from "../components/ListPage";
import { getBikes } from "../services/vehicleApi";
export default function Bikes() { return <ListPage title="Used Bikes" fetcher={getBikes} base="bikes" />; }
