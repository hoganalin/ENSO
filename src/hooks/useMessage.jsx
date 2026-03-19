import { useDispatch } from "react-redux";
import { createAsyncAddMessage } from "../slice/messageSlice";

function useMessage() {
  const dispatch = useDispatch();
  const showSuccess = (message) => {
    dispatch(createAsyncAddMessage({ success: true, message }));
  };
  const showError = (message) => {
    dispatch(createAsyncAddMessage({ success: false, message }));
  };
  return { showSuccess, showError };
}

export default useMessage;
