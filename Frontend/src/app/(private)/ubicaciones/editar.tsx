import Screen from '../../../screens/UbicacionFormScreen';
import ModalForm from '../../../components/ModalForm';
export default function FormRoute() {
  return <ModalForm title="Editar ubicación" fallback="/ubicaciones"><Screen /></ModalForm>;
}
