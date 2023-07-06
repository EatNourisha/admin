import { download } from "utils";

import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";

interface IState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isDownloading: boolean;
}

function str2bytes(str: string) {
  var bytes = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

export function useExport() {
  const { actions } = useErrorStore();

  const [state, set] = usePartialState<IState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDownloading: false,
  });

  const exportUserDocs = async (onProgress?: (progress: number) => void) => {
    try {
      set({ isLoading: true, isSuccess: false });
      const result = await download(
        "https://cors-anywhere.herokuapp.com/https://ziglang.org/builds/zig-windows-x86-0.11.0-dev.3910+689f3163a.zip",
        (progress) => {
          onProgress && onProgress(progress);
          set({
            isDownloading: progress >= 1 && progress < 100,
          });
        }
      ).then((blob: any) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([str2bytes(blob)], { type: "application/zip" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "");

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode?.removeChild(link);

        return blob;
      });

      console.log("Download Progress", "-> Done", result);
      set({ isLoading: false, isSuccess: true, isDownloading: false });
    } catch (error: any) {
      set({ isError: true, isDownloading: false, isLoading: false });
      actions?.setError({
        action: { type: "exports/user_data", payload: null },
        message: error?.message,
        status: error?.statusCode,
        showUser: true,
      });
    }
  };

  return { exportUserDocs, ...state };
}
