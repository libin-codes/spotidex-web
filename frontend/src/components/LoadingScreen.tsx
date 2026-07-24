import { PacmanLoader } from "react-spinners";

export default function LoadingScreen() {
 

  return (
    <div className="spinner-container w-full h-full flex items-center justify-center ">
      <PacmanLoader
        color="#27272a"
        data-slot="spinner"
        loading={true}
        speedMultiplier={2}
        size={30}
        aria-label="Loading Spinner"
      />
    </div>
  );
}
