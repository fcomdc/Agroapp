import Screen from '../../screens/FarmScreen';
import ModalForm from '../../components/ModalForm';
export default function FormRoute() {
  return <ModalForm title="Datos de la finca" fallback="/gestion"><Screen /></ModalForm>;
}
