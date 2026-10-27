import Screen from '../../../screens/VacunacionFormScreen';
import ModalForm from '../../../components/ModalForm';
export default function FormRoute() {
  return <ModalForm title="Registrar vacuna" fallback="/vacunas"><Screen /></ModalForm>;
}
