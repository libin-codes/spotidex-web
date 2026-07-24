import { SyncLoader } from "react-spinners";

export default function LoadingScreen() {
 

  return (
    <div className="spinner-container w-full h-full flex items-center justify-center ">
      <SyncLoader
        color="#27272a"
        data-slot="spinner"
        loading={true}
        speedMultiplier={0.75}
        size={10}
        aria-label="Loading Spinner"
      />
    </div>
  );
}
