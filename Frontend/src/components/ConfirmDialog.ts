import { Alert } from 'react-native';

interface Props { title?: string; message?: string; onConfirm: () => void; onCancel?: () => void; confirmText?: string; cancelText?: string; destructive?: boolean; }


/**
 * Muestra un diálogo de confirmación reutilizable basado en Alert
 * @param {string} title - Título del diálogo
 * @param {string} message - Mensaje del diálogo
 * @param {Function} onConfirm - Función a ejecutar al confirmar
 * @param {Function} onCancel - Función a ejecutar al cancelar (opcional)
 * @param {string} confirmText - Texto del botón de confirmación
 * @param {string} cancelText - Texto del botón de cancelación
 * @param {boolean} destructive - Si la acción es destructiva (estilo rojo)
 */
const ConfirmDialog = ({
  title = '¿Está seguro?',
  message = 'Esta acción no se puede deshacer.',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  destructive = false,
}: Props) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
};

/**
 * Muestra un diálogo de confirmación para eliminar
 * @param {string} itemName - Nombre del elemento a eliminar
 * @param {Function} onConfirm - Función a ejecutar al confirmar
 */
export const confirmDelete = (itemName: string, onConfirm: () => void) => {
  ConfirmDialog({
    title: 'Eliminar registro',
    message: `¿Está seguro de que desea eliminar ${itemName}? Esta acción no se puede deshacer.`,
    onConfirm,
    confirmText: 'Eliminar',
    destructive: true,
  });
};

export default ConfirmDialog;

