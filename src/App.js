import './App.css';
import { useState, useEffect } from 'react'
import MainMenu from './components/MainMenu';
import MapContainer from './components/MapContainer';
import MenuIcon from './assets/icons/menu.svg';
import InformationPanel from './components/InformationPanel';
import LocalStorageKeys from './local-storage/localStorageKeys.ts';

function App() {
    const [selectedLayer, setSelectedLayer] = useState();
    const [isMenuToggle, setMenuToggle] = useState(true);
    const [isInfoPanelDisplayed, setInfoPanelDisplayed] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(LocalStorageKeys.IS_INFO_PANEL_HIDDEN)) {
            setInfoPanelDisplayed(true);
        }
    }, []);

    return (
    <div className="app">
        <MainMenu isMenuToggle={isMenuToggle} setMenuToggle={setMenuToggle} selectedLayer={selectedLayer} setSelectedLayer={setSelectedLayer}/>
        <MapContainer selectedLayer={selectedLayer}/>
        {
            isInfoPanelDisplayed &&
            <InformationPanel setInfoPanelDisplayed={setInfoPanelDisplayed}/>
        }
        {
            !isInfoPanelDisplayed &&
            <button className='open-info-panel-button' onClick={() => setInfoPanelDisplayed(true)}>
                ?
            </button>
        }
        {
            !isMenuToggle &&
            <div className='absolute-menu-icon-wrapper'>
              <img src={MenuIcon} alt='menu icon' className='menu-icon absolute-menu-icon' onClick={() => setMenuToggle(!isMenuToggle)}/>
            </div>
        }
    </div>
    );
}

export default App;
