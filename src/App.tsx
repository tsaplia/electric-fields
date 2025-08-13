import Canvas from "@/components/shared/canvas";
import Sidebar from "@/components/shared/sidebar/sidebar";
import ToolGroup from "@/components/shared/tool-group";
import Scaler from "@/components/shared/scaler";
import ChargeEditModal from "./components/shared/charge-edit-modal";
import { useChargeStore } from "./stores/charge-store";
import { useEffect } from "react";

function App() {
    const setActive = useChargeStore((state) => state.setActive);
    const setModal = useChargeStore(state => state.setModal)
    useEffect(() => {
        setActive(0);
        setModal(true);
    }, [setActive, setModal]);
    return (
        <div className="p-2 w-screen h-screen">
            <div className="flex h-full">
                <main className="flex-grow h-full relative">
                    <Canvas className="fixed top-0 left-0 w-screen h-screen" />
                    <ToolGroup className="absolute top-2 left-2" />
                    <Scaler className="absolute bottom-2 right-2" />
                </main>
                <Sidebar />
            </div>
            <ChargeEditModal/>
        </div>
    );
}

export default App;
