import Screen from '../../../screens/UbicacionFormScreen';
import ModalForm from '../../../components/ModalForm';
export default function FormRoute() {
  return <ModalForm title="Nueva ubicación" fallback="/ubicaciones"><Screen /></ModalForm>;
}
