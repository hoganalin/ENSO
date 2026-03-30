import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { createAsyncAddMessage } from "../slice/messageSlice";

function useMessage() {
  const dispatch = useDispatch<AppDispatch>();
  const showSuccess = (message: string) => {
    dispatch(createAsyncAddMessage({ success: true, message }));
  };
  const showError = (message: string) => {
    dispatch(createAsyncAddMessage({ success: false, message }));
  };
  return { showSuccess, showError };
}

export default useMessage;
