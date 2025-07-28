import { AppDispatch } from './store';
import { clearCart } from './slices/cartSlice';


export const resetStore = () => (dispatch: AppDispatch) => {
  dispatch(clearCart());
};
