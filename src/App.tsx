import Sidebar from "./components/shared/sidebar/sidebar";
import ToolGroup from "./components/shared/tool-group";
import Scaler from "@/components/shared/scaler";

function App() {
    return (
        <div className="p-2 w-screen h-screen">
            <div className="flex h-full">
                <main className="flex-grow h-full relative">
                    <ToolGroup className="absolute top-2 left-2" />
                    <Scaler className="absolute bottom-2 right-2" />
                </main>
                <Sidebar />
            </div>
        </div>
    );
}

export default App;
