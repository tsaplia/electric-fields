import {Sidebar, SidebarToggle} from "@/components/shared/sidebar";
import ToolGroup from "./components/shared/tool-group";
import Scaler from "./components/shared/Scaler";

function App() {
    return <div className="p-2 w-screen h-screen">
        <div className="flex gap-4 h-full">
            <main className="flex-grow h-full relative">
                <ToolGroup className="absolute top-0 left-0"/>
                <SidebarToggle className="absolute top-0 right-0"/>
                <Scaler className="absolute bottom-0 right-0"/>
            </main>
            <Sidebar/>
        </div>
    </div>
}

export default App;
