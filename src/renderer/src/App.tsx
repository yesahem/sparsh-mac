import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ipcRenderer } from "electron";
import { session } from "@electron/remote";
import NavBar from "./components/Navbar2";
import Home from "./pages/Home";
import Contest from "./pages/Contests";
import Versions from "./components/Versions";
import Attempt from "./pages/ContestAttempt";
import { useEffect, useState } from "react";
declare global {
  interface Window {
    electron: {
     
      onDeepLinkData: (callback: (data: { cb_auth?: string; one_auth?: string;contestId?:string ;contentId?:string}) => void) => void
      process: {
        versions: NodeJS.ProcessVersions
      }
    }
  }
}
export default function App(): JSX.Element {
  const [cbAuth, setCbAuth] = useState<string | null>(null);
  const [oneAuth, setOneAuth] = useState<string | null>(null);
  const [contestId,setContestId]=useState<string|null>(null)
  const [contentId,setContentId]=useState<string|null>(null)
  useEffect(() => {
    // Fetch stored auth data from localStorage
    const storedCbAuth = localStorage.getItem("cb_auth");
    const storedOneAuth = localStorage.getItem("one_auth");
    const contestId=localStorage.getItem('contestId')
    const contentId=localStorage.getItem('contentId')
    setCbAuth(storedCbAuth);
    setOneAuth(storedOneAuth);
    setContestId(contestId)
    setContentId(contentId)

    // Listen for deep link data from main process
    if (window.electron && window.electron.onDeepLinkData) {
      window.electron.onDeepLinkData((data) => {
        // console.log("Deep link data received in renderer:", data);

        if (data.cb_auth) {
          localStorage.setItem("cb_auth", data.cb_auth);
          setCbAuth(data.cb_auth);
        }
        if (data.contestId) {
          localStorage.setItem("contestId", data.contestId);
          setOneAuth(data.contestId);
        }

        if (data.one_auth) {
          localStorage.setItem("one_auth", data.one_auth);
          setOneAuth(data.one_auth);
        }
        if (data.contentId) {
          localStorage.setItem("contentId", data.contentId);
          setContentId(data.contentId);
        }
      });
    }
  }, []);

  return (
    <Router>
     <NavBar contentId={contentId} contestId={contestId} />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/contests/:contestId/attempt/:contentId" element={<Attempt />} />
        </Routes>
      </div>
    </Router>
  );
}
