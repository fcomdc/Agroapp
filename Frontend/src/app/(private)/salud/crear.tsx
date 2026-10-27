import Screen from '../../../screens/ReporteSaludFormScreen';
import ModalForm from '../../../components/ModalForm';
export default function FormRoute() {
  return <ModalForm title="Observación de salud" fallback="/salud"><Screen /></ModalForm>;
}
