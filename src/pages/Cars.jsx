import ListPage from "../components/ListPage";
import { getCars } from "../services/vehicleApi";
export default function Cars() { return <ListPage title="Used Cars" fetcher={getCars} base="cars" />; }
